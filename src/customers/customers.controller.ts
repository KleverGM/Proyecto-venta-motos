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
  UseGuards,
  Req,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { Customer } from './customer.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// Definir interfaz extendida para Request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    roles: string[];
  };
}

@Controller('customers')
@UseGuards(AuthGuard()) // Protege todas las rutas con autenticación
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() dto: CreateCustomerDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.id;
    const customer = await this.customersService.create(dto, userId);
    
    if (!customer) {
      throw new InternalServerErrorException('Could not create customer profile');
    }
    
    return new SuccessResponseDto('Customer profile created successfully', customer);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('isActive') isActive?: string,
  ) {
    // Validar parámetros de paginación
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    if (isNaN(pageNum)) { // CORRECCIÓN: Paréntesis agregados
      throw new BadRequestException('Invalid page number');
    }
    if (isNaN(limitNum)) { // CORRECCIÓN: Paréntesis agregados
      throw new BadRequestException('Invalid limit value');
    }
    
    // Validar isActive
    let isActiveBool: boolean | undefined;
    if (isActive !== undefined) {
      if (isActive === 'true') {
        isActiveBool = true;
      } else if (isActive === 'false') {
        isActiveBool = false;
      } else {
        throw new BadRequestException('Invalid value for isActive (use true or false)');
      }
    }
    
    const result = await this.customersService.findAll({
      page: pageNum,
      limit: limitNum,
      isActive: isActiveBool
    });
    
    if (!result) {
      throw new InternalServerErrorException('Could not retrieve customers');
    }

    return new SuccessResponseDto('Customers retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOne(id);
    
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    
    return new SuccessResponseDto('Customer retrieved successfully', customer);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    const customer = await this.customersService.update(id, dto);
    
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    
    return new SuccessResponseDto('Customer updated successfully', customer);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const customer = await this.customersService.remove(id);
    
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    
    return new SuccessResponseDto('Customer profile deleted successfully', customer);
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
    if (!file) {
      throw new BadRequestException('Profile image is required');
    }
    
    const customer = await this.customersService.updateProfile(id, file.filename);
    
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    
    return new SuccessResponseDto('Profile image updated', customer);
  }

  // Endpoint para obtener el perfil del usuario autenticado
  @Get('my-profile')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const customer = await this.customersService.findByUserId(userId);
    
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    
    return new SuccessResponseDto('Profile retrieved successfully', customer);
  }
}