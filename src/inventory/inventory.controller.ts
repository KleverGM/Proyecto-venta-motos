import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './inventory.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async create(@Body() dto: CreateInventoryDto) {
    const inventory = await this.inventoryService.create(dto);
    if (!inventory)
      throw new InternalServerErrorException('Failed to create inventory');
    return inventory;
  }

  @Get()
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const inventory = await this.inventoryService.findOne(id);
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    const inventory = await this.inventoryService.update(id, dto);
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.inventoryService.remove(id);
    if (!deleted) throw new NotFoundException('Inventory not found');
    return { deleted: true };
  }
}
