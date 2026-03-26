import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Lot } from './entities/lot.entity';
import { Category } from '../categories/entities/category.entity';
import { Sale } from '../sales/entities/sale.entity';

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private readonly lotsRepository: Repository<Lot>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  private async resolveSeller(data: any): Promise<{ id: string; displayName: string }> {
    const sellerId = String(data?.sellerId || data?.seller_id || '').trim();

    if (!sellerId) {
      throw new BadRequestException('Le vendeur est obligatoire');
    }

    const rows = await this.dataSource.query(
      `
      SELECT *
      FROM mazadtn.sellers
      WHERE id = $1
      LIMIT 1
      `,
      [sellerId],
    );

    const seller = rows?.[0];

    if (!seller) {
      throw new BadRequestException('Le vendeur sélectionné est introuvable dans la table sellers');
    }

    const displayName =
      seller.display_name ||
      seller.displayname ||
      seller.name ||
      seller.company_name ||
      seller.companyname ||
      seller.legal_name ||
      seller.legalname ||
      seller.email ||
      'Vendeur';

    return {
      id: String(seller.id),
      displayName: String(displayName),
    };
  }

  async findAll(): Promise<any[]> {
    const lots = await this.lotsRepository.find({
      order: { createdAt: 'DESC' },
    });

    const saleIds = [...new Set(lots.map((x) => x.saleId).filter(Boolean))] as string[];
    const sales = saleIds.length
      ? await this.salesRepository.find({ where: { id: In(saleIds) } as any })
      : [];

    const saleMap = new Map(sales.map((s) => [s.id, s]));

    return lots.map((lot) => {
      const sale = lot.saleId ? saleMap.get(lot.saleId) : null;
      return {
        ...lot,
        saleTitle: sale?.title || null,
      };
    });
  }

  async findActive(): Promise<any[]> {
    const lots = await this.findAll();
    return lots.filter((lot: any) => String(lot.status || '').toLowerCase() === 'active');
  }

  async findOne(id: string): Promise<any> {
    const lot = await this.lotsRepository.findOne({
      where: { id } as any,
    });

    if (!lot) {
      throw new NotFoundException('Lot introuvable');
    }

    let saleTitle: string | null = null;

    if (lot.saleId) {
      const sale = await this.salesRepository.findOne({
        where: { id: lot.saleId } as any,
      });
      saleTitle = sale?.title || null;
    }

    return {
      ...lot,
      saleTitle,
    };
  }

  async create(data: any): Promise<Lot> {
    const title = String(data?.title || '').trim();
    if (!title) {
      throw new BadRequestException('Le titre du lot est obligatoire');
    }

    const saleId = data?.saleId ? String(data.saleId).trim() : '';
    if (!saleId) {
      throw new BadRequestException('Une vente doit être sélectionnée pour ce lot');
    }

    const sale = await this.salesRepository.findOne({
      where: { id: saleId } as any,
    });

    if (!sale) {
      throw new BadRequestException('La vente sélectionnée est introuvable');
    }

    if (data?.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: String(data.categoryId) } as any,
      });

      if (!category) {
        throw new BadRequestException('La catégorie sélectionnée est introuvable');
      }
    }

    const seller = await this.resolveSeller(data);

    const lot = new Lot();
    lot.title = title;
    lot.slug = String(data?.slug || '').trim() || slugify(title);
    lot.lotNumber = data?.lotNumber ? String(data.lotNumber) : null;
    lot.reference = data?.reference ? String(data.reference) : null;
    lot.description = data?.description ? String(data.description) : null;
    lot.sellerId = seller.id;
    lot.sellerName = seller.displayName;
    lot.locationCity = data?.locationCity ? String(data.locationCity) : null;
    lot.locationGovernorate = data?.locationGovernorate ? String(data.locationGovernorate) : null;
    lot.startingPrice = data?.startingPrice != null ? String(data.startingPrice) : null;
    lot.currentPrice =
      data?.currentPrice != null
        ? String(data.currentPrice)
        : data?.startingPrice != null
        ? String(data.startingPrice)
        : null;
    lot.bidIncrementAmount = data?.bidIncrementAmount != null ? String(data.bidIncrementAmount) : null;
    lot.reservePrice = data?.reservePrice != null ? String(data.reservePrice) : null;
    lot.buyerFeePercent = data?.buyerFeePercent != null ? String(data.buyerFeePercent) : null;
    lot.vatApplicable = !!data?.vatApplicable;
    lot.autoBiddingEnabled = !!data?.autoBiddingEnabled;
    lot.autoExtendMinutes =
      data?.autoExtendMinutes != null && data?.autoExtendMinutes !== ''
        ? Number(data.autoExtendMinutes)
        : null;
    lot.isFeatured = !!data?.isFeatured;
    lot.status = String(data?.status || 'draft').trim().toLowerCase();
    lot.condition = data?.condition ? String(data.condition) : null;
    lot.startsAt = data?.startsAt ? new Date(data.startsAt) : null;
    lot.endsAt = data?.endsAt ? new Date(data.endsAt) : null;
    lot.bidCount = Number(data?.bidCount || 0);
    lot.viewCount = Number(data?.viewCount || 0);
    lot.imageUrl = data?.imageUrl ? String(data.imageUrl) : null;
    lot.categoryId = data?.categoryId ? String(data.categoryId) : null;
    lot.saleId = saleId;

    return this.lotsRepository.save(lot);
  }

  async update(id: string, data: any): Promise<Lot> {
    const lot = await this.lotsRepository.findOne({
      where: { id } as any,
    });

    if (!lot) {
      throw new NotFoundException('Lot introuvable');
    }

    if (data?.saleId !== undefined) {
      const saleId = data?.saleId ? String(data.saleId).trim() : '';
      if (!saleId) {
        throw new BadRequestException('Une vente doit être sélectionnée pour ce lot');
      }

      const sale = await this.salesRepository.findOne({
        where: { id: saleId } as any,
      });

      if (!sale) {
        throw new BadRequestException('La vente sélectionnée est introuvable');
      }

      lot.saleId = saleId;
    }

    if (data?.categoryId !== undefined && data?.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: String(data.categoryId) } as any,
      });

      if (!category) {
        throw new BadRequestException('La catégorie sélectionnée est introuvable');
      }

      lot.categoryId = String(data.categoryId);
    }

    if (data?.sellerId !== undefined || data?.seller_id !== undefined) {
      const seller = await this.resolveSeller(data);
      lot.sellerId = seller.id;
      lot.sellerName = seller.displayName;
    }

    if (data?.title !== undefined) lot.title = String(data.title || '').trim();
    if (data?.slug !== undefined) lot.slug = String(data.slug || '').trim() || slugify(lot.title);
    if (data?.lotNumber !== undefined) lot.lotNumber = data.lotNumber ? String(data.lotNumber) : null;
    if (data?.reference !== undefined) lot.reference = data.reference ? String(data.reference) : null;
    if (data?.description !== undefined) lot.description = data.description ? String(data.description) : null;
    if (data?.sellerName !== undefined && !data?.sellerId && !data?.seller_id) {
      lot.sellerName = data.sellerName ? String(data.sellerName) : null;
    }
    if (data?.locationCity !== undefined) lot.locationCity = data.locationCity ? String(data.locationCity) : null;
    if (data?.locationGovernorate !== undefined) lot.locationGovernorate = data.locationGovernorate ? String(data.locationGovernorate) : null;
    if (data?.startingPrice !== undefined) lot.startingPrice = data.startingPrice != null ? String(data.startingPrice) : null;
    if (data?.currentPrice !== undefined) lot.currentPrice = data.currentPrice != null ? String(data.currentPrice) : null;
    if (data?.bidIncrementAmount !== undefined) lot.bidIncrementAmount = data.bidIncrementAmount != null ? String(data.bidIncrementAmount) : null;
    if (data?.reservePrice !== undefined) lot.reservePrice = data.reservePrice != null ? String(data.reservePrice) : null;
    if (data?.buyerFeePercent !== undefined) lot.buyerFeePercent = data.buyerFeePercent != null ? String(data.buyerFeePercent) : null;
    if (data?.vatApplicable !== undefined) lot.vatApplicable = !!data.vatApplicable;
    if (data?.autoBiddingEnabled !== undefined) lot.autoBiddingEnabled = !!data.autoBiddingEnabled;
    if (data?.autoExtendMinutes !== undefined) {
      lot.autoExtendMinutes =
        data.autoExtendMinutes != null && data.autoExtendMinutes !== ''
          ? Number(data.autoExtendMinutes)
          : null;
    }
    if (data?.isFeatured !== undefined) lot.isFeatured = !!data.isFeatured;
    if (data?.status !== undefined) lot.status = String(data.status || '').trim().toLowerCase();
    if (data?.condition !== undefined) lot.condition = data.condition ? String(data.condition) : null;
    if (data?.startsAt !== undefined) lot.startsAt = data.startsAt ? new Date(data.startsAt) : null;
    if (data?.endsAt !== undefined) lot.endsAt = data.endsAt ? new Date(data.endsAt) : null;
    if (data?.imageUrl !== undefined) lot.imageUrl = data.imageUrl ? String(data.imageUrl) : null;

    return this.lotsRepository.save(lot);
  }

  async remove(id: string): Promise<{ success: boolean; id: string }> {
    const lot = await this.lotsRepository.findOne({
      where: { id } as any,
    });

    if (!lot) {
      throw new NotFoundException('Lot introuvable');
    }

    await this.lotsRepository.remove(lot);
    return { success: true, id };
  }
}