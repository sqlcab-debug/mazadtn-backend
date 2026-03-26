import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { Lot } from './entities/lot.entity';
import { Category } from '../categories/entities/category.entity';
import { Sale } from '../sales/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lot, Category, Sale])],
  controllers: [LotsController],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}