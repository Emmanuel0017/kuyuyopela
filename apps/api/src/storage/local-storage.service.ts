import { Injectable } from '@nestjs/common';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { StorageService, UploadResult } from './storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
  private uploadDir = join(process.cwd(), 'uploads');

  async upload(file: Express.Multer.File): Promise<UploadResult> {
  const key = `${randomUUID()}-${file.originalname}`;
  await writeFile(join(this.uploadDir, key), file.buffer);
  const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:3000';
  return { url: `${baseUrl}/uploads/${key}`, key };
}

  async delete(key: string): Promise<void> {
    await unlink(join(this.uploadDir, key)).catch(() => undefined);
  }
}