import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto'; // Cambia a CreateCustomerDto
import { UpdateCustomerDto } from './dto/update-customer.dto'; // Cambia a UpdateCustomerDto
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Customer } from './customer.entity'; // Asegúrate de que el nombre del archivo sea correcto
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('customers') // Cambia la ruta a 'customers'
export class CustomersController { // Cambia el nombre de la clase a CustomersController
  constructor(private readonly customersService: CustomersService) {} // Cambia a CustomersService

  @Post()
  async create(@Body() dto: CreateCustomerDto) { // Cambia a CreateCustomerDto
    const customer = await this.customersService.create(dto); // Cambia a customersService
    return new SuccessResponseDto('Customer created successfully', customer); // Cambia a 'Customer'
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('isActive') isActive?: string,
  ): Promise<SuccessResponseDto<Pagination<Customer>>> { // Cambia a Customer
    if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
      throw new BadRequestException(
        'Invalid value for "isActive". Use "true" or "false".',
      );
    }
    const result = await this.customersService.findAll( // Cambia a customersService
      { page, limit },
      isActive === 'true',
    );
    if (!result)
      throw new InternalServerErrorException('Could not retrieve customers'); // Cambia a 'customers'

    return new SuccessResponseDto('Customers retrieved successfully', result); // Cambia a 'Customers'
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOne(id); // Cambia a customersService
    if (!customer) throw new NotFoundException('Customer not found'); // Cambia a 'Customer'
    return new SuccessResponseDto('Customer retrieved successfully', customer); // Cambia a 'Customer'
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) { // Cambia a UpdateCustomerDto
    const customer = await this.customersService.update(id, dto); // Cambia a customersService
    if (!customer) throw new NotFoundException('Customer not found'); // Cambia a 'Customer'
    return new SuccessResponseDto('Customer updated successfully', customer); // Cambia a 'Customer'
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const customer = await this.customersService.remove(id); // Cambia a customersService
    if (!customer) throw new NotFoundException('Customer not found'); // Cambia a 'Customer'
    return new SuccessResponseDto('Customer deleted successfully', customer); // Cambia a 'Customer'
  }

  @Put(':id/profile')
  @UseInterceptors(
    FileInterceptor('profile', {
      storage: diskStorage({
        destination: './public/profile',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Only JPG or PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Profile image is required');
    const customer = await this.customersService.updateProfile(id, file.filename); // Cambia a customersService
    if (!customer) throw new NotFoundException('Customer not found'); // Cambia a 'Customer'
    return new SuccessResponseDto('Profile image updated', customer); // Cambia a 'Customer'
  }
}
