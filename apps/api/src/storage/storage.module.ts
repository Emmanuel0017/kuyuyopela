// apps/api/src/storage/storage.module.ts
import { Module } from '@nestjs/common';
import { STORAGE_SERVICE } from './storage.interface';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Module({
  providers: [{ provide: STORAGE_SERVICE, useClass: CloudinaryStorageService }],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}