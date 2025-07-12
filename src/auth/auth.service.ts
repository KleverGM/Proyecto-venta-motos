import { BadRequestException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { CustomersService } from '../customers/customers.service';
import { RegisterUserDto } from './dto/register-user.dto'; // Importa el DTO de registro si existe

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private customersService: CustomersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roles', 'name'],
    });
    
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = this.createJwtPayload(user);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      }
    };
  }

  async register(registerDto: RegisterUserDto | any) {
    const { email, password, name, phone_number, address, profileImage } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      roles: ['user'], // Rol predeterminado
    });

    const savedUser = await this.userRepository.save(newUser);

    // Crear cliente asociado con datos completos
    const createCustomerDto: CreateCustomerDto = {
      name,
      email,
      phone_number,
      address,
      profileImage
    };
    
    await this.customersService.create(createCustomerDto, savedUser.id);

    const payload = this.createJwtPayload(savedUser);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        roles: savedUser.roles,
      },
    };
  }

  async deleteUser(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    // Primero eliminar el cliente asociado
    const customer = await this.customersService.getCustomerByUserId(user.id);
    if (customer) {
      await this.customersService.remove(customer.id);
    }
    
    // Luego eliminar el usuario
    await this.userRepository.delete(user.id);
    return { message: 'Usuario eliminado correctamente' };
  }

  createJwtPayload(user: User) {
    return {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
  }
}