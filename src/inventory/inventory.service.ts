import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Motorcycle } from '../motorcycles/motorcycle.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async create(dto: CreateInventoryDto): Promise<Inventory | null> {
    try {
      const inventory = this.inventoryRepo.create({
        ...dto,
        motorcycle: { id: dto.motorcycle } as Motorcycle,
      });
      return await this.inventoryRepo.save(inventory);
    } catch (err) {
      console.error('Error creating inventory:', err);
      return null;
    }
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepo.find();
  }

  async findOne(id: string): Promise<Inventory | null> {
    return this.inventoryRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<Inventory | null> {
    const inventory = await this.findOne(id);
    if (!inventory) return null;
    Object.assign(inventory, dto);
    return this.inventoryRepo.save(inventory);
  }

  async remove(id: string): Promise<boolean> {
    const inventory = await this.findOne(id);
    if (!inventory) return false;
    await this.inventoryRepo.remove(inventory);
    return true;
  }
}
