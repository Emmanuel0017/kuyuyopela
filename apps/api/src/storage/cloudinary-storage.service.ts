// apps/api/src/storage/cloudinary-storage.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { MulterFile } from '../common/multer-file.type';
import { StorageService, UploadResult } from './storage.interface';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryStorageService implements StorageService {
  async upload(file: MulterFile): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'kuyuyopela' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, key: result.public_id });
        },
      );
      stream.end(file.buffer);
    });
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key).catch(() => undefined);
  }
}