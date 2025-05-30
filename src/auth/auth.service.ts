import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from '../customers/customers.service';
import { LoginDto } from './dto/login.dto';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import * as bcrypt from 'bcrypt';
import { Customer } from '../customers/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    try {
      // Buscar por email (username es el email)
      const customer: Customer | null = await this.customersService.findByEmail(
        loginDto.username,
      );
      if (!customer) return null;
      // Validar contraseña
      // customer['password'] solo funcionará si el campo existe en la entidad
      if (!customer['password']) return null;
      const isValid = await bcrypt.compare(loginDto.password, customer['password']);
      if (!isValid) return null;
      const payload = { id: customer.id, email: customer.email };
      return this.jwtService.sign(payload);
    } catch (err) {
      console.error('Unexpected login error:', err);
      return null;
    }
  }

  async register(createCustomerDto: CreateCustomerDto): Promise<string | null> {
    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(createCustomerDto['password'], 10);
    const customerToCreate = { ...createCustomerDto, password: hashedPassword };
    const customer = await this.customersService.create(customerToCreate);
    if (!customer) return null;
    const payload = { id: customer.id, email: customer.email };
    return this.jwtService.sign(payload);
  }
}
