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
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get('roots')
  async findRoots() {
    return this.categoriesService.findRoots();
  }

  @Post()
  async create(
    @Body()
    body: {
      nameFr: string;
      nameAr?: string;
      nameEn?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    return this.categoriesService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body()
    body: Partial<{
      nameFr: string;
      nameAr: string;
      nameEn: string;
      sortOrder: number;
      isActive: boolean;
    }>,
  ) {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.remove(id);
  }

  @Post(':id/disable')
  async disable(@Param('id') id: string) {
    return this.categoriesService.disable(id);
  }

  @Post(':id/enable')
  async enable(@Param('id') id: string) {
    return this.categoriesService.enable(id);
  }

  @Post(':id/disable-tree')
  async disableTree(@Param('id') id: string) {
    return this.categoriesService.disableTree(id);
  }

}