import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service'; // Cambia a CustomersService
import { CustomersController } from './customers.controller'; // Cambia a CustomersController
import { Customer } from './customer.entity'; // Cambia a Customer

@Module({
  imports: [TypeOrmModule.forFeature([Customer])], // Cambia a Customer
  controllers: [CustomersController], // Cambia a CustomersController
  providers: [CustomersService], // Cambia a CustomersService
  exports: [CustomersService], // Cambia a CustomersService
})
export class CustomersModule {} // Cambia a CustomersModule
