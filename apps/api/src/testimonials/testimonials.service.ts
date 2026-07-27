import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { STORAGE_SERVICE } from '../storage/storage.interface';
import { Inject } from '@nestjs/common';
import type { StorageService } from '../storage/storage.interface';
import type { MulterFile } from '../common/multer-file.type';

@Injectable()
export class TestimonialsService {
  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private storage: StorageService,
  ) {}

  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const t = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Testimonial not found');
    return t;
  }

  create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data: dto });
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    await this.findOne(id);
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.testimonial.delete({ where: { id } });
  }

  // ───── image uploads ─────
  private async replaceImage(currentUrl: string | null | undefined, file: MulterFile) {
    if (currentUrl) {
      const oldKey = currentUrl.split('/').pop();
      if (oldKey) await this.storage.delete(oldKey).catch(() => undefined);
    }
    return this.storage.upload(file);
  }

  async uploadBeforeImage(id: string, file: MulterFile) {
    const t = await this.findOne(id);
    const { url } = await this.replaceImage(t.beforeImage, file);
    return this.prisma.testimonial.update({ where: { id }, data: { beforeImage: url } });
  }

  async uploadAfterImage(id: string, file: MulterFile) {
    const t = await this.findOne(id);
    const { url } = await this.replaceImage(t.afterImage, file);
    return this.prisma.testimonial.update({ where: { id }, data: { afterImage: url } });
  }
}