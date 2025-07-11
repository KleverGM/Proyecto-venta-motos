import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { CustomersService } from '../customers/customers.service';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly customersService: CustomersService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'role']
      });
      
      if (!user) return null;
      
      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (err) {
      throw new InternalServerErrorException('Error validando usuario');
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload = { 
        email: user.email, 
        sub: user.id,
        role: user.role
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException('Error en el proceso de login');
    }
  }

  async register(registerDto: RegisterUserDto): Promise<{ access_token: string }> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.userRepository.findOne({ 
        where: { email: registerDto.email } 
      });
      
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      
      // Crear nuevo usuario
      const newUser = this.userRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        role: 'customer'
      });
      
      const savedUser = await this.userRepository.save(newUser);
      
      // Crear perfil de cliente asociado
      const createCustomerDto: CreateCustomerDto = {
        customer_name: registerDto.customer_name,
        phone_number: registerDto.phone_number,
        address: registerDto.address
      };
      
      await this.customersService.create(createCustomerDto, savedUser.id);
      
      // Generar token de acceso
      const payload = { 
        email: savedUser.email, 
        sub: savedUser.id,
        role: savedUser.role
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      
      // Eliminar usuario si se creó pero falló la creación del cliente
      if (registerDto.email) {
        const user = await this.userRepository.findOne({ where: { email: registerDto.email } });
        if (user) {
          await this.userRepository.delete(user.id);
        }
      }
      
      throw new InternalServerErrorException('Error en el registro de usuario');
    }
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}