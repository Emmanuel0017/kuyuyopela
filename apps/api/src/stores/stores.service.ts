import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.store.findMany();
  }

  create(dto: CreateStoreDto) {
    return this.prisma.store.create({ data: dto });
  }

  async update(id: string, dto: UpdateStoreDto) {
    const existing = await this.prisma.store.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Store not found');
    return this.prisma.store.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const existing = await this.prisma.store.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Store not found');
    return this.prisma.store.delete({ where: { id } });
  }
}