import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Motorcycle } from './motorcycle.entity';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';

@Injectable()
export class MotorcyclesService {
  constructor(
    @InjectRepository(Motorcycle)
    private readonly motorcycleRepo: Repository<Motorcycle>,
  ) {}

  async create(dto: CreateMotorcycleDto): Promise<Motorcycle | null> {
    try {
      const motorcycle = this.motorcycleRepo.create(dto);
      return await this.motorcycleRepo.save(motorcycle);
    } catch (err) {
      console.error('Error creating motorcycle:', err);
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Motorcycle> | null> {
    try {
      const query = this.motorcycleRepo.createQueryBuilder('motorcycle');
      return await paginate<Motorcycle>(query, options);
    } catch (err) {
      console.error('Error retrieving motorcycles:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Motorcycle | null> {
    try {
      return await this.motorcycleRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding motorcycle:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateMotorcycleDto): Promise<Motorcycle | null> {
    try {
      const motorcycle = await this.findOne(id);
      if (!motorcycle) return null;

      Object.assign(motorcycle, dto);
      return await this.motorcycleRepo.save(motorcycle);
    } catch (err) {
      console.error('Error updating motorcycle:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Motorcycle | null> {
    try {
      const motorcycle = await this.findOne(id);
      if (!motorcycle) return null;

      return await this.motorcycleRepo.remove(motorcycle);
    } catch (err) {
      console.error('Error deleting motorcycle:', err);
      return null;
    }
  }
}
