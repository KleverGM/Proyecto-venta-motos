// src/mongodb/provider/provider.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { Provider } from './provider.model';

@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  async create(@Body() providerData: Partial<Provider>) {
    return this.providerService.create(providerData);
  }

  @Get()
  async findAll() {
    return this.providerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.providerService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() providerData: Partial<Provider>) {
    return this.providerService.update(id, providerData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.providerService.remove(id);
  }
}