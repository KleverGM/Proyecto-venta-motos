import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory } from './inventory.entity';
import { Motorcycle } from '../motorcycles/motorcycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Motorcycle])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
