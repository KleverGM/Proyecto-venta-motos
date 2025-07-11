import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  Query, 
  NotFoundException, 
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { Service, ServiceStatus } from './service.model';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() serviceData: Partial<Service>) {
    try {
      return await this.serviceService.create(serviceData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: ServiceStatus
  ) {
    try {
      return await this.serviceService.findAll(page, limit, status);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.serviceService.findById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() serviceData: Partial<Service>
  ) {
    try {
      return await this.serviceService.update(id, serviceData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: ServiceStatus
  ) {
    try {
      return await this.serviceService.updateStatus(id, status);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.serviceService.delete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Get('customer/:customerId')
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    try {
      return await this.serviceService.findByCustomer(customerId, page, limit);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Get('motorcycle/:motorcycleId')
  async findByMotorcycle(
    @Param('motorcycleId') motorcycleId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    try {
      return await this.serviceService.findByMotorcycle(motorcycleId, page, limit);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Get('period/:startDate/:endDate')
  async getServicesByPeriod(
    @Param('startDate') startDateStr: string,
    @Param('endDate') endDateStr: string,
    @Query('status') status?: ServiceStatus
  ) {
    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      
      // Corrección aplicada aquí: se agregaron llaves para el bloque if
      if (isNaN(startDate.getTime())) {
        throw new BadRequestException('Fecha de inicio inválida');
      }
      
      if (isNaN(endDate.getTime())) {
        throw new BadRequestException('Fecha de fin inválida');
      }
      
      return await this.serviceService.getServicesByPeriod(startDate, endDate, status);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  @Get('stats/statistics')
  async getServiceStatistics() {
    try {
      return await this.serviceService.getServiceStatistics();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof NotFoundException || 
        error instanceof BadRequestException) {
      return error;
    }
    return new BadRequestException(error.message || 'Error interno del servidor');
  }
}