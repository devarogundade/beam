/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product';
import { Hex } from 'viem';

export type SaleDocument = HydratedDocument<Sale>;

@Schema()
export class Sale {
  @Prop({ required: true })
  merchant: Hex;

  @Prop({ required: true })
  buyer: Hex;

  @Prop({ required: true, type: Types.ObjectId })
  product: Types.ObjectId | Product | null;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  token: Hex;

  @Prop({ required: true })
  amountInUsd: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ default: undefined })
  updatedAt?: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
