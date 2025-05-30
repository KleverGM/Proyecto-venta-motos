import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './sale.entity';
import { Motorcycle } from '../motorcycles/motorcycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Motorcycle])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
