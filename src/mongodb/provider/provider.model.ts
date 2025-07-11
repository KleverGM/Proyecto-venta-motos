import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Provider extends Document {
  @Prop({ 
    type: String,
    required: true,
    trim: true,
    index: true
  })
  name: string;

  @Prop({ 
    trim: true,
    index: true
  })
  contact?: string;

  @Prop({ 
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true, // Permite múltiples nulls pero no duplicados
    index: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'] // Validación de formato email
  })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ 
    type: [String], 
    default: [],
    index: true
  })
  motosSupplied?: string[];
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
export type ProviderDocument = Provider & Document;

// Índices compuestos para optimización
ProviderSchema.index({ name: 1, email: 1 });