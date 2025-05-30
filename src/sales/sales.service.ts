import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Motorcycle } from '../motorcycles/motorcycle.entity';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,
  ) {}

  async create(dto: CreateSaleDto): Promise<Sale | null> {
    try {
      // Si motorcycle es string (id), asignar como objeto parcial
      const sale = this.saleRepo.create({
        ...dto,
        motorcycle: typeof dto.motorcycle === 'string' ? { id: dto.motorcycle } as Motorcycle : dto.motorcycle,
      });
      return await this.saleRepo.save(sale);
    } catch (err) {
      console.error('Error creating sale:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Sale> | null> {
    try {
      const query = this.saleRepo.createQueryBuilder('sale');
      return await paginate<Sale>(query, options);
    } catch (err) {
      console.error('Error retrieving sales:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Sale | null> {
    try {
      return await this.saleRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding sale:', err);
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const sale = await this.findOne(id);
      if (!sale) return false;
      await this.saleRepo.remove(sale);
      return true;
    } catch (err) {
      console.error('Error deleting sale:', err);
      return false;
    }
  }
}
