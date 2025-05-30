import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  // Buscar cliente por email
  async findByEmail(email: string): Promise<Customer | null> {
    try {
      return await this.customerRepo.findOne({ where: { email } });
    } catch (err) {
      console.error('Error finding customer by email:', err);
      return null;
    }
  }

  async create(dto: CreateCustomerDto): Promise<Customer | null> {
    try {
      const customer = this.customerRepo.create(dto);
      return await this.customerRepo.save(customer);
    } catch (err) {
      console.error('Error creating customer:', err);
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
    isActive?: boolean,
  ): Promise<Pagination<Customer> | null> {
    try {
      const query = this.customerRepo.createQueryBuilder('customer');
      if (isActive !== undefined) {
        query.where('customer.isActive = :isActive', { isActive });
      }
      return await paginate<Customer>(query, options);
    } catch (err) {
      console.error('Error retrieving customers:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Customer | null> {
    try {
      return await this.customerRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding customer:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer | null> {
    try {
      const customer = await this.findOne(id);
      if (!customer) return null;

      Object.assign(customer, dto);
      return await this.customerRepo.save(customer);
    } catch (err) {
      console.error('Error updating customer:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Customer | null> {
    try {
      const customer = await this.findOne(id);
      if (!customer) return null;

      return await this.customerRepo.remove(customer);
    } catch (err) {
      console.error('Error deleting customer:', err);
      return null;
    }
  }

  async updateProfile(id: string, filename: string): Promise<Customer | null> {
    try {
      const customer = await this.findOne(id);
      if (!customer) return null;

      customer.profile = filename;
      return await this.customerRepo.save(customer);
    } catch (err) {
      console.error('Error updating customer profile image:', err);
      return null;
    }
  }
}
