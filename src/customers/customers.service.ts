import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '../auth/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Crear un nuevo cliente
  async create(createCustomerDto: CreateCustomerDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      user, // Asignar la relación con el usuario
    });

    return this.customerRepository.save(customer);
  }

  // Obtener todos los clientes con paginación
  async findAll(options?: { page?: number; limit?: number; isActive?: boolean }) {
    const { page = 1, limit = 10, isActive } = options || {};
    const skip = (page - 1) * limit;
    
    const [customers, total] = await this.customerRepository.findAndCount({
      where: isActive !== undefined ? { isActive } : {},
      relations: ['user'],
      skip,
      take: limit,
    });

    return {
      items: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  // Obtener un cliente por ID
  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return customer;
  }

  // Actualizar un cliente
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.preload({
      id,
      ...updateCustomerDto
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return this.customerRepository.save(customer);
  }

  // Eliminar un cliente
  async remove(id: string) {
    const customer = await this.findOne(id);
    return this.customerRepository.remove(customer);
  }

  // Actualizar la imagen de perfil
  async updateProfile(id: string, profileImage: string) {
    const customer = await this.findOne(id);
    customer.profileImage = profileImage;
    return this.customerRepository.save(customer);
  }

  // Buscar cliente por ID de usuario
  async findByUserId(userId: string) {
    const customer = await this.customerRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['user'],
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente para usuario ID ${userId} no encontrado`);
    }
    
    return customer;
  }

  // Método original (alias para findByUserId)
  async getCustomerByUserId(userId: string) {
    return this.findByUserId(userId);
  }
}