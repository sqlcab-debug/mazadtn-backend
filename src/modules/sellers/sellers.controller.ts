import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('sellers')
export class SellersController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async getSellers() {
    const rows = await this.dataSource.query(`
      SELECT *
      FROM mazadtn.sellers
      ORDER BY id
    `);

    return (rows || []).map((row: any) => ({
      id: row.id,
      name:
        row.display_name ||
        row.displayname ||
        row.name ||
        row.company_name ||
        row.companyname ||
        row.legal_name ||
        row.legalname ||
        row.email ||
        'Vendeur',
      raw: row,
    }));
  }
}