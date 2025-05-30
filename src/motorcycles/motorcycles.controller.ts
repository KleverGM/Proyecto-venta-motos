import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MotorcyclesService } from './motorcycles.service';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Motorcycle } from './motorcycle.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('motorcycles')
export class MotorcyclesController {
  constructor(private readonly motorcyclesService: MotorcyclesService) {}

  @Post()
  async create(@Body() dto: CreateMotorcycleDto) {
    const motorcycle = await this.motorcyclesService.create(dto);
    if (!motorcycle)
      throw new InternalServerErrorException('Failed to create motorcycle');
    return new SuccessResponseDto('Motorcycle created successfully', motorcycle);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<Motorcycle>>> {
    const result = await this.motorcyclesService.findAll({ page, limit });

    if (!result)
      throw new InternalServerErrorException('Could not retrieve motorcycles');

    return new SuccessResponseDto('Motorcycles retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const motorcycle = await this.motorcyclesService.findOne(id);
    if (!motorcycle) throw new NotFoundException('Motorcycle not found');
    return new SuccessResponseDto('Motorcycle retrieved successfully', motorcycle);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMotorcycleDto) {
    const motorcycle = await this.motorcyclesService.update(id, dto);
    if (!motorcycle) throw new NotFoundException('Motorcycle not found');
    return new SuccessResponseDto('Motorcycle updated successfully', motorcycle);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const motorcycle = await this.motorcyclesService.remove(id);
    if (!motorcycle) throw new NotFoundException('Motorcycle not found');
    return new SuccessResponseDto('Motorcycle deleted successfully', motorcycle);
  }
}
