import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { Lot } from '../lots/entities/lot.entity';

function toNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidsRepository: Repository<Bid>,
    @InjectRepository(Lot)
    private readonly lotsRepository: Repository<Lot>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findByLot(lotId: string): Promise<any[]> {
    const bids = await this.bidsRepository.find({
      where: { lotId } as any,
      order: { bidTime: 'DESC', createdAt: 'DESC' },
    });

    return bids.map((bid: Bid) => ({
      id: bid.id,
      bidderUserId: bid.bidderUserId,
      amount: bid.amount,
      status: bid.status,
      userEmail: bid.userEmail || '',
      userName: bid.userName || '',
      bidTime: bid.bidTime,
      isProxy: bid.isProxy,
      maxProxyAmount: bid.maxProxyAmount,
    }));
  }

  async create(data: any, actor?: any): Promise<any> {
    const lotId = String(data?.lotId || '').trim();
    if (!lotId) {
      throw new BadRequestException('Le lot est obligatoire');
    }

    const amount = toNumber(data?.amount);
    if (!amount || amount <= 0) {
      throw new BadRequestException('Le montant de l’enchère est invalide');
    }

    const actorUserId =
      actor?.sub ||
      actor?.id ||
      actor?.userId ||
      '';

    const actorEmail =
      actor?.email ||
      actor?.userEmail ||
      '';

    const actorName =
      actor?.full_name ||
      actor?.fullName ||
      actor?.name ||
      actor?.userName ||
      '';

    if (!actorUserId) {
      throw new BadRequestException('Utilisateur enchérisseur introuvable');
    }

    if (!actorEmail) {
      throw new BadRequestException('Utilisateur enchérisseur sans email');
    }

    return this.dataSource.transaction('READ COMMITTED', async (manager) => {
      const lotRepo = manager.getRepository(Lot);
      const bidRepo = manager.getRepository(Bid);

      const lot = await lotRepo
        .createQueryBuilder('lot')
        .setLock('pessimistic_write')
        .where('lot.id = :id', { id: lotId })
        .getOne();

      if (!lot) {
        throw new NotFoundException('Lot introuvable');
      }

      const lotStatus = String(lot.status || '').toLowerCase();
      if (lotStatus !== 'active') {
        throw new BadRequestException('Le lot doit être actif pour recevoir des enchères');
      }

      if (lot.endsAt) {
        const now = new Date();
        const endsAt = new Date(lot.endsAt);
        if (now > endsAt) {
          throw new BadRequestException('La vente de ce lot est terminée');
        }
      }

      const currentPrice = toNumber(lot.currentPrice || lot.startingPrice || 0);
      const bidIncrement = toNumber(lot.bidIncrementAmount || 0);
      const minimumRequired = currentPrice + bidIncrement;

      if (amount <= currentPrice) {
        throw new BadRequestException(
          `L’enchère doit être supérieure au prix actuel (${currentPrice})`,
        );
      }

      if (bidIncrement > 0 && amount < minimumRequired) {
        throw new BadRequestException(
          `L’enchère doit être au minimum de ${minimumRequired}`,
        );
      }

      const existingWinning = await bidRepo.findOne({
        where: {
          lotId: lot.id,
          status: 'winning',
        } as any,
        order: {
          bidTime: 'DESC',
          createdAt: 'DESC',
        },
      });

      if (
        existingWinning &&
        String(existingWinning.bidderUserId || '') === String(actorUserId)
      ) {
        throw new BadRequestException('Vous êtes déjà le meilleur enchérisseur sur ce lot');
      }

      const bid = bidRepo.create({
        lotId: lot.id,
        bidderUserId: String(actorUserId),
        amount: String(amount),
        userEmail: String(actorEmail),
        userName: String(actorName || ''),
        isProxy: !!data?.isProxy,
        maxProxyAmount:
          data?.maxProxyAmount != null && data?.maxProxyAmount !== ''
            ? String(data.maxProxyAmount)
            : null,
        status: 'winning',
        bidTime: new Date(),
      });

      const savedBid: Bid = await bidRepo.save(bid);

      if (existingWinning) {
        existingWinning.status = 'outbid';
        await bidRepo.save(existingWinning);
      }

      lot.currentPrice = String(amount);
      lot.bidCount = Number(lot.bidCount || 0) + 1;

      await lotRepo.save(lot);

      return {
        success: true,
        bidId: savedBid.id,
        lotId: lot.id,
        bidderUserId: savedBid.bidderUserId,
        currentPrice: lot.currentPrice,
        bidCount: lot.bidCount,
        amount: savedBid.amount,
        userEmail: savedBid.userEmail,
        userName: savedBid.userName,
        bidTime: savedBid.bidTime,
      };
    });
  }
}
