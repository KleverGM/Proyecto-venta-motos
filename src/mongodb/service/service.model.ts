import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Service extends Document {
  @Prop({
    type: String,
    required: true,
    ref: 'Customer', // Referencia al modelo de cliente
    index: true
  })
  customerId: string;

  @Prop({
    type: String,
    required: true,
    ref: 'Motorcycle', // Referencia al modelo de moto
    index: true
  })
  motorcycleId: string;

  @Prop({
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  })
  description?: string;

  @Prop({
    type: Date,
    default: Date.now,
    index: true
  })
  date: Date;

  @Prop({
    type: String,
    default: 'pendiente',
    enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'],
    index: true
  })
  status: ServiceStatus;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
export type ServiceDocument = Service & Document;

// Índices compuestos
ServiceSchema.index({ customerId: 1, status: 1 });
ServiceSchema.index({ motorcycleId: 1, date: -1 });
ServiceSchema.index({ date: -1, status: 1 });