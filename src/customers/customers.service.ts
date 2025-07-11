import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
import { User } from '../auth/user.entity'; // Importar entidad User

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Crear cliente asociado a un usuario existente
  async create(dto: CreateCustomerDto, userId: string): Promise<Customer> {
    try {
      // 1. Buscar usuario existente
      const user = await this.userRepo.findOne({ 
        where: { id: userId },
        relations: ['customer']
      });
      
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      
      // 2. Verificar si ya tiene perfil de cliente
      if (user.customer) {
        throw new InternalServerErrorException('El usuario ya tiene un perfil de cliente asociado');
      }

      // 3. Crear nuevo cliente
      const customer = this.customerRepo.create(dto);
      customer.user = user; // Asociar usuario
      
      // 4. Guardar y retornar
      return await this.customerRepo.save(customer);
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof InternalServerErrorException) {
        throw err;
      }
      throw new InternalServerErrorException('Error creando perfil de cliente');
    }
  }

  // Buscar cliente por ID de usuario
  async findByUserId(userId: string): Promise<Customer | null> {
    try {
      return await this.customerRepo.findOne({ 
        where: { user: { id: userId } },
        relations: ['user']
      });
    } catch (err) {
      throw new InternalServerErrorException('Error buscando perfil de cliente');
    }
  }

  // Obtener todos los clientes (con paginación)
  async findAll(
    options: IPaginationOptions,
    isActive?: boolean,
  ): Promise<Pagination<Customer>> {
    try {
      const query = this.customerRepo
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.user', 'user');
        
      if (isActive !== undefined) {
        query.andWhere('customer.isActive = :isActive', { isActive });
      }
      
      return await paginate<Customer>(query, options);
    } catch (err) {
      throw new InternalServerErrorException('Error obteniendo clientes');
    }
  }

  // Buscar cliente por ID
  async findOne(id: string): Promise<Customer> {
    try {
      const customer = await this.customerRepo.findOne({ 
        where: { id },
        relations: ['user']
      });
      
      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
      
      return customer;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Error buscando cliente');
    }
  }

  // Actualizar cliente
  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    try {
      const customer = await this.customerRepo.findOne({ 
        where: { id },
        relations: ['user']
      });
      
      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }

      // Actualizar solo campos permitidos
      Object.assign(customer, dto);
      return await this.customerRepo.save(customer);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Error actualizando cliente');
    }
  }

  // Eliminar cliente (no elimina usuario)
  async remove(id: string): Promise<Customer> {
    try {
      const customer = await this.customerRepo.findOne({ 
        where: { id },
        relations: ['user'] 
      });
      
      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }

      // Desasociar usuario si existe
      if (customer.user) {
        customer.user = null;
        await this.customerRepo.save(customer);
      }
      
      return await this.customerRepo.remove(customer);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Error eliminando cliente');
    }
  }

  // Actualizar imagen de perfil
  async updateProfile(id: string, filename: string): Promise<Customer> {
    try {
      const customer = await this.customerRepo.findOne({ where: { id } });
      
      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }

      customer.profile = filename;
      return await this.customerRepo.save(customer);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Error actualizando imagen de perfil');
    }
  }
}