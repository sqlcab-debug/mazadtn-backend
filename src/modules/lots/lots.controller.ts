import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LotsService } from './lots.service';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  async findAll() {
    return this.lotsService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.lotsService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.lotsService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.lotsService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: any,
  ) {
    return this.lotsService.update(id, body);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { status: string },
  ) {
    return this.lotsService.update(id, { status: body?.status });
  }

  @Patch(':id/featured')
  async updateFeatured(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { featured: boolean },
  ) {
    return this.lotsService.update(id, { featured: !!body?.featured });
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.lotsService.remove(id);
  }
}