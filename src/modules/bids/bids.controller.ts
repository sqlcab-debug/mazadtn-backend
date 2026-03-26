import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BidsService } from './bids.service';

@Controller('bids')
export class BidsController {

  constructor(private readonly bidsService:BidsService){}

  @Get('lot/:lotId')
  async findByLot(@Param('lotId')lotId:string){
    return this.bidsService.findByLot(lotId)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body:any,
    @Request() req:any
  ){
    return this.bidsService.create(body,req.user)
  }

}