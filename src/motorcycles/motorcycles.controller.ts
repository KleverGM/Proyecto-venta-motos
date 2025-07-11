import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  Patch,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MotorcyclesService } from './motorcycles.service';
import { UploadService } from '../upload/upload.service';

@Controller('motorcycles')
export class MotorcyclesController {
  constructor(
    private readonly motorcyclesService: MotorcyclesService,
    private readonly uploadService: UploadService
  ) {}

  // Subir imagen con UUID
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string, // Usar string para UUID
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
      })
    ) file: Express.Multer.File
  ) {
    const imageUrl = await this.uploadService.uploadMotorcycleImage(file);
    await this.motorcyclesService.update(id, { imageUrl });
    return { imageUrl };
  }

  // Eliminar imagen con UUID
  @Patch(':id/remove-image')
  async removeImage(@Param('id') id: string) {
    await this.motorcyclesService.update(id, { imageUrl: null });
    return { message: 'Imagen eliminada correctamente' };
  }
}