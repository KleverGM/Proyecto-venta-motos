import { forwardRef, Module } from '@nestjs/common'; // Añade forwardRef
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { User } from '../auth/user.entity';
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, User]),
    forwardRef(() => AuthModule), // Usa forwardRef aquí
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService]
})
export class CustomersModule {}