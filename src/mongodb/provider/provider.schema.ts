import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Provider extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  contact: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: [String] })
  motosSupplied: string[];
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);