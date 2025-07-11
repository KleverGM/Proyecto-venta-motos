import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PriceHistory extends Document {
  @Prop({ required: true, type: String })
  productId: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: String })
  currency: string; // Ej: 'USD', 'COP'
}

export const PriceHistorySchema = SchemaFactory.createForClass(PriceHistory);