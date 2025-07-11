import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class PriceHistory extends Document {
  @Prop({ 
    type: String,
    required: true,
    index: true
  })
  productId: string;

  @Prop({
    type: Number,
    required: true,
    min: 0
  })
  price: number;

  @Prop({
    type: Date,
    default: Date.now
  })
  date: Date;

  @Prop({
    type: String,
    default: 'USD'
  })
  currency: string;
}

export const PriceHistorySchema = SchemaFactory.createForClass(PriceHistory);
export type PriceHistoryDocument = PriceHistory & Document;

// Índices compuestos para optimización
PriceHistorySchema.index({ productId: 1, date: -1 });