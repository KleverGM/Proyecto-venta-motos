import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorcycle } from './motorcycle.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MotorcyclesService {
  constructor(
    @InjectRepository(Motorcycle)
    private motorcycleRepository: Repository<Motorcycle>,
  ) {}

  // Actualizar con soporte para UUID y null
  async update(id: string, updateData: Partial<Motorcycle>): Promise<Motorcycle> {
    const existing = await this.motorcycleRepository.findOne({ 
      where: { id } 
    });
    
    if (!existing) {
      throw new NotFoundException(`Motorcycle with id ${id} not found`);
    }

    // Eliminar imagen anterior solo si se está actualizando y existe
    if (updateData.imageUrl !== undefined && existing.imageUrl) {
      this.deleteImageFile(existing.imageUrl);
    }

    await this.motorcycleRepository.update(id, updateData);
    
    const updated = await this.motorcycleRepository.findOne({ 
      where: { id } 
    });
    
    if (!updated) {
      throw new NotFoundException(`Motorcycle with id ${id} not found after update`);
    }
    return updated;
  }

  // Manejo seguro de eliminación de imágenes
  private deleteImageFile(imageUrl: string | null) {
    if (!imageUrl) return;

    try {
      const filePath = path.join(
        __dirname, 
        '..', '..', 'public', 
        imageUrl
      );
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error eliminando archivo de imagen', error);
    }
  }
}