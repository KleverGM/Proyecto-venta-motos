import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Provider, ProviderDocument } from './provider.model';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
  ) {}

  async create(providerData: Partial<Provider>): Promise<ProviderDocument> {
    // Verificar si el proveedor ya existe por email
    if (providerData.email) {
      const existingProvider = await this.providerModel.findOne({ 
        email: providerData.email 
      });
      
      if (existingProvider) {
        throw new ConflictException('A provider with this email already exists');
      }
    }

    const createdProvider = new this.providerModel(providerData);
    return createdProvider.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: ProviderDocument[],
    total: number,
    page: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;
    
    const [providers, total] = await Promise.all([
      this.providerModel.find().skip(skip).limit(limit).exec(),
      this.providerModel.countDocuments().exec()
    ]);

    return {
      data: providers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<ProviderDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid provider ID format');
    }

    const provider = await this.providerModel.findById(id).exec();
    
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    
    return provider;
  }

  async update(id: string, providerData: Partial<Provider>): Promise<ProviderDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid provider ID format');
    }

    // Verificar duplicado de email si se está actualizando
    if (providerData.email) {
      const existingProvider = await this.providerModel.findOne({
        email: providerData.email,
        _id: { $ne: id } // Excluir el proveedor actual
      });
      
      if (existingProvider) {
        throw new ConflictException('A provider with this email already exists');
      }
    }

    const updatedProvider = await this.providerModel
      .findByIdAndUpdate(id, providerData, { new: true, runValidators: true })
      .exec();

    if (!updatedProvider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    
    return updatedProvider;
  }

  async remove(id: string): Promise<ProviderDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid provider ID format');
    }

    const deletedProvider = await this.providerModel.findByIdAndDelete(id).exec();
    
    if (!deletedProvider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    
    return deletedProvider;
  }

  async findByEmail(email: string): Promise<ProviderDocument | null> {
    return this.providerModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async addMotorcycleToProvider(providerId: string, motorcycleId: string): Promise<ProviderDocument> {
    if (!isValidObjectId(providerId) || !isValidObjectId(motorcycleId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const updatedProvider = await this.providerModel
      .findByIdAndUpdate(
        providerId,
        { $addToSet: { motosSupplied: motorcycleId } },
        { new: true }
      )
      .exec();

    if (!updatedProvider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }
    
    return updatedProvider;
  }

  async removeMotorcycleFromProvider(providerId: string, motorcycleId: string): Promise<ProviderDocument> {
    if (!isValidObjectId(providerId) || !isValidObjectId(motorcycleId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const updatedProvider = await this.providerModel
      .findByIdAndUpdate(
        providerId,
        { $pull: { motosSupplied: motorcycleId } },
        { new: true }
      )
      .exec();

    if (!updatedProvider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }
    
    return updatedProvider;
  }

  async searchProviders(query: string): Promise<ProviderDocument[]> {
    return this.providerModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).limit(10).exec();
  }
}