import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { STORAGE_SERVICE } from '../storage/storage.interface';
import type { StorageService } from '../storage/storage.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MulterFile } from '../common/multer-file.type';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private storage: StorageService,
  ) {}

  findAll(includeInactive = false) {
    return this.prisma.product.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async uploadImage(id: string, file: MulterFile) {
    const product = await this.findOne(id);
    if (product.imageUrl) {
      const oldKey = product.imageUrl.split('/').pop();
      if (oldKey) await this.storage.delete(oldKey).catch(() => undefined);
    }
    const { url } = await this.storage.upload(file);
    return this.prisma.product.update({ where: { id }, data: { imageUrl: url } });
  }

  async remove(id: string) {
    await this.findOne(id);
    // soft delete — orders reference products, hard delete would orphan history
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }
}