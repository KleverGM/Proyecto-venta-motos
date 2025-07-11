// src/motorcycles/motorcycles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotorcyclesController } from './motorcycles.controller';
import { MotorcyclesService } from './motorcycles.service';
import { Motorcycle } from './motorcycle.entity';
import { UploadModule } from '../upload/upload.module';
import { AuthModule } from '../auth/auth.module'; // Importación necesaria

@Module({
  imports: [
    TypeOrmModule.forFeature([Motorcycle]),
    UploadModule,
    AuthModule, // Importa AuthModule aquí
  ],
  controllers: [MotorcyclesController],
  providers: [MotorcyclesService],
})
export class MotorcyclesModule {}