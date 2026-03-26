import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: {
        sortOrder: 'ASC',
        createdAt: 'ASC',
      },
    });
  }

  async findRoots(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: {
        isActive: true,
      },
      order: {
        sortOrder: 'ASC',
        createdAt: 'ASC',
      },
    });
  }

  async create(data: {
    nameFr: string;
    nameAr?: string;
    nameEn?: string;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<Category> {
    const category = new Category();
    category.nameFr = String(data.nameFr || '').trim();
    category.nameAr = data.nameAr ? String(data.nameAr).trim() : undefined;
    category.nameEn = data.nameEn ? String(data.nameEn).trim() : undefined;
    category.sortOrder = data.sortOrder ?? 0;
    category.isActive = data.isActive ?? true;

    return this.categoriesRepository.save(category);
  }

  async update(
    id: string,
    data: Partial<{
      nameFr: string;
      nameAr: string;
      nameEn: string;
      sortOrder: number;
      isActive: boolean;
    }>,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id } as any,
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    if (data.nameFr !== undefined) category.nameFr = String(data.nameFr).trim();
    if (data.nameAr !== undefined)
      category.nameAr = data.nameAr ? String(data.nameAr).trim() : undefined;
    if (data.nameEn !== undefined)
      category.nameEn = data.nameEn ? String(data.nameEn).trim() : undefined;
    if (data.sortOrder !== undefined) category.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) category.isActive = data.isActive;

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<{ success: true; id: string }> {
    const category = await this.categoriesRepository.findOne({
      where: { id } as any,
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    await this.categoriesRepository.remove(category);

    return {
      success: true,
      id,
    };
  }

  async disable(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id } as any,
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    (category as any).isActive = false;
    if ('status' in category) {
      (category as any).status = 'inactive';
    }

    return this.categoriesRepository.save(category as any);
  }

  async enable(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id } as any,
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    (category as any).isActive = true;
    if ('status' in category) {
      (category as any).status = 'active';
    }

    return this.categoriesRepository.save(category as any);
  }

  async disableTree(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id } as any,
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    (category as any).isActive = false;

    if ('status' in (category as any)) {
      (category as any).status = 'inactive';
    }

    await this.categoriesRepository.save(category as any);

    return {
      success: true,
      disabledIds: [id],
      warning:
        'Le module catégories ne gère pas encore la hiérarchie parent/enfant côté backend. Désactivation appliquée uniquement à la catégorie sélectionnée.',
    };
  }
}
