import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.salesService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.salesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}