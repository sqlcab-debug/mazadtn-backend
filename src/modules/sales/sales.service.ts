import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';

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
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
  ) {}

  async findAll(): Promise<any[]> {
    const sales = await this.salesRepository.find({
      order: { createdAt: 'DESC' },
    });

    return sales.map((sale) => ({
      ...sale,
      lotsCount: 0,
    }));
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id } as any,
    });

    if (!sale) {
      throw new NotFoundException('Vente introuvable');
    }

    return sale;
  }

  async create(data: any): Promise<Sale> {
    const sale = new Sale();
    sale.title = String(data?.title || '').trim();
    sale.slug = String(data?.slug || '').trim() || slugify(sale.title);
    sale.description = data?.description ? String(data.description) : null;
    sale.sellerName = data?.sellerName ? String(data.sellerName) : null;
    sale.status = String(data?.status || 'draft').trim().toLowerCase();
    sale.startsAt = data?.startsAt ? new Date(data.startsAt) : null;
    sale.endsAt = data?.endsAt ? new Date(data.endsAt) : null;
    sale.depositAmount = data?.depositAmount != null ? String(data.depositAmount) : null;
    sale.isFeatured = !!data?.isFeatured;

    return this.salesRepository.save(sale);
  }

  async update(id: string, data: any): Promise<Sale> {
    const sale = await this.findOne(id);

    if (data?.title !== undefined) sale.title = String(data.title || '').trim();
    if (data?.slug !== undefined) sale.slug = String(data.slug || '').trim() || slugify(sale.title);
    if (data?.description !== undefined) sale.description = data.description ? String(data.description) : null;
    if (data?.sellerName !== undefined) sale.sellerName = data.sellerName ? String(data.sellerName) : null;
    if (data?.status !== undefined) sale.status = String(data.status || '').trim().toLowerCase();
    if (data?.startsAt !== undefined) sale.startsAt = data.startsAt ? new Date(data.startsAt) : null;
    if (data?.endsAt !== undefined) sale.endsAt = data.endsAt ? new Date(data.endsAt) : null;
    if (data?.depositAmount !== undefined) sale.depositAmount = data.depositAmount != null ? String(data.depositAmount) : null;
    if (data?.isFeatured !== undefined) sale.isFeatured = !!data.isFeatured;

    return this.salesRepository.save(sale);
  }

  async remove(id: string): Promise<{ success: boolean; id: string }> {
    const sale = await this.findOne(id);
    await this.salesRepository.remove(sale);
    return { success: true, id };
  }
}