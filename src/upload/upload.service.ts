import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  async uploadMotorcycleImage(file: Express.Multer.File): Promise<string> {
    if (!file?.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Solo se permiten imágenes');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'public', 'motorcycles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `/motorcycles/${fileName}`;
  }
}