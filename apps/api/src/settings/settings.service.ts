import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { STORAGE_SERVICE } from '../storage/storage.interface';
import type { StorageService } from '../storage/storage.interface';
import type { MulterFile } from '../common/multer-file.type';

const SINGLETON_ID = 'singleton';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private storage: StorageService,
  ) {}

  async get() {
    const existing = await this.prisma.siteSettings.findUnique({ where: { id: SINGLETON_ID } });
    if (existing) return existing;
    return this.prisma.siteSettings.create({
      data: {
        id: SINGLETON_ID,
        siteName: 'Kuyuyopela Industries',
        supportPhone: '0999 666 670',
        supportEmail: 'info@kuyuyopela.com',
        whatsappNumber: '+265 999 666 670',
        aboutImageUrl: null,
      },
    });
  }

  async update(dto: UpdateSettingsDto) {
    await this.get();
    return this.prisma.siteSettings.update({ where: { id: SINGLETON_ID }, data: dto });
  }

  async uploadAboutImage(file: MulterFile) {
    const current = await this.get();
    if (current.aboutImageUrl) {
      const oldKey = current.aboutImageUrl.split('/').pop();
      if (oldKey) await this.storage.delete(oldKey).catch(() => undefined);
    }
    const { url } = await this.storage.upload(file);
    return this.prisma.siteSettings.update({ where: { id: SINGLETON_ID }, data: { aboutImageUrl: url } });
  }
}