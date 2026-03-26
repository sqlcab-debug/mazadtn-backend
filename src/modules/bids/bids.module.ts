import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Lot } from '../lots/entities/lot.entity';
import { User } from '../users/entities/user.entity';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { BidsGateway } from './bids.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Lot, User])],
  controllers: [BidsController],
  providers: [BidsService, BidsGateway],
  exports: [BidsService, BidsGateway],
})
export class BidsModule {}