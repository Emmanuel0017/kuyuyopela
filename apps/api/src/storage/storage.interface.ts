export interface UploadResult {
  url: string;
  key: string;
}
import { MulterFile } from '../common/multer-file.type';

export interface StorageService {
  upload(file: MulterFile): Promise<UploadResult>;
  delete(key: string): Promise<void>;
}

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');