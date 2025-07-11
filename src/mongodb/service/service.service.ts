import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Service, ServiceDocument, ServiceStatus } from './service.model';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(serviceData: Partial<Service>): Promise<ServiceDocument> {
    // Validar campos requeridos
    if (!serviceData.customerId) {
      throw new BadRequestException('customerId is required');
    }
    if (!serviceData.motorcycleId) {
      throw new BadRequestException('motorcycleId is required');
    }
    
    await this.validateCustomer(serviceData.customerId);
    await this.validateMotorcycle(serviceData.motorcycleId);
    
    // Validar que no haya servicios duplicados pendientes
    const existingService = await this.serviceModel.findOne({
      customerId: serviceData.customerId,
      motorcycleId: serviceData.motorcycleId,
      status: 'pendiente'
    });
    
    if (existingService) {
      throw new ConflictException('Ya existe un servicio pendiente para este cliente y moto');
    }

    const createdService = new this.serviceModel({
      ...serviceData,
      status: 'pendiente' // Fuerza el estado inicial
    });
    
    return createdService.save();
  }

  async findAll(
    page: number = 1, 
    limit: number = 10,
    status?: ServiceStatus
  ): Promise<{
    data: ServiceDocument[],
    total: number,
    page: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;
    const query = status ? { status } : {};
    
    const [services, total] = await Promise.all([
      this.serviceModel.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.serviceModel.countDocuments(query).exec()
    ]);

    return {
      data: services,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string): Promise<ServiceDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID de servicio inválido');
    }
    
    const service = await this.serviceModel.findById(id).exec();
    
    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    
    return service;
  }

  async findByCustomer(
    customerId: string,
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    data: ServiceDocument[],
    total: number,
    page: number,
    totalPages: number
  }> {
    if (!isValidObjectId(customerId)) {
      throw new BadRequestException('ID de cliente inválido');
    }
    
    const skip = (page - 1) * limit;
    const query = { customerId };
    
    const [services, total] = await Promise.all([
      this.serviceModel.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.serviceModel.countDocuments(query).exec()
    ]);

    return {
      data: services,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByMotorcycle(
    motorcycleId: string,
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    data: ServiceDocument[],
    total: number,
    page: number,
    totalPages: number
  }> {
    if (!isValidObjectId(motorcycleId)) {
      throw new BadRequestException('ID de moto inválido');
    }
    
    const skip = (page - 1) * limit;
    const query = { motorcycleId };
    
    const [services, total] = await Promise.all([
      this.serviceModel.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.serviceModel.countDocuments(query).exec()
    ]);

    return {
      data: services,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateStatus(
    id: string, 
    status: ServiceStatus
  ): Promise<ServiceDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID de servicio inválido');
    }
    
    // Definir transiciones válidas
    const validTransitions: Record<ServiceStatus, ServiceStatus[]> = {
      pendiente: ['en_proceso', 'cancelado'],
      en_proceso: ['completado', 'cancelado'],
      completado: [],
      cancelado: []
    };
    
    const currentService = await this.serviceModel.findById(id).exec();
    if (!currentService) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    
    // Verificar si la transición es válida
    const allowedTransitions = validTransitions[currentService.status];
    if (!allowedTransitions.includes(status)) {
      throw new BadRequestException(
        `Transición de estado inválida: ${currentService.status} -> ${status}`
      );
    }
    
    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
      .exec();
    
    return updatedService!;
  }

  async update(
    id: string, 
    serviceData: Partial<Service>
  ): Promise<ServiceDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID de servicio inválido');
    }
    
    // Validar que no se esté intentando cambiar el estado por este método
    if (serviceData.status) {
      throw new BadRequestException(
        'Use el método updateStatus para cambiar el estado del servicio'
      );
    }
    
    // Validar referencias si se están actualizando
    if (serviceData.customerId) {
      await this.validateCustomer(serviceData.customerId);
    }
    
    if (serviceData.motorcycleId) {
      await this.validateMotorcycle(serviceData.motorcycleId);
    }
    
    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, serviceData, { new: true, runValidators: true })
      .exec();
    
    if (!updatedService) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    
    return updatedService;
  }

  async delete(id: string): Promise<ServiceDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID de servicio inválido');
    }
    
    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();
    
    if (!deletedService) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    
    return deletedService;
  }

  async getServicesByPeriod(
    startDate: Date, 
    endDate: Date,
    status?: ServiceStatus
  ): Promise<ServiceDocument[]> {
    const query: any = {
      date: { $gte: startDate, $lte: endDate }
    };
    
    if (status) query.status = status;
    
    return this.serviceModel.find(query)
      .sort({ date: -1 })
      .exec();
  }

  async getServiceStatistics(): Promise<{
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    const results = await this.serviceModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Inicializar estadísticas
    const stats = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    };
    
    // Mapear resultados a estadísticas
    results.forEach(result => {
      switch (result._id) {
        case 'pendiente':
          stats.pending = result.count;
          break;
        case 'en_proceso':
          stats.inProgress = result.count;
          break;
        case 'completado':
          stats.completed = result.count;
          break;
        case 'cancelado':
          stats.cancelled = result.count;
          break;
      }
    });
    
    return stats;
  }

  private async validateCustomer(customerId: string): Promise<void> {
    if (!isValidObjectId(customerId)) {
      throw new BadRequestException('ID de cliente inválido');
    }
    // Aquí iría la lógica para verificar que el cliente existe
    // Simulamos con un retardo
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  private async validateMotorcycle(motorcycleId: string): Promise<void> {
    if (!isValidObjectId(motorcycleId)) {
      throw new BadRequestException('ID de moto inválido');
    }
    // Aquí iría la lógica para verificar que la moto existe
    // Simulamos con un retardo
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}