/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product';
import { Hex } from 'viem';
import { TransactionType, TransactionStatus } from 'src/types';
import { Plan } from './plan';

export type SaleDocument = HydratedDocument<Sale>;

@Schema()
export class Sale {
  @Prop({ required: true })
  transactionId: Hex;

  @Prop({ required: true })
  merchant: Hex;

  @Prop({ required: true })
  buyer: Hex;

  @Prop({ required: true, type: Types.ObjectId, ref: Product.name })
  product?: string | Product;

  @Prop({ required: true, type: Types.ObjectId, ref: Plan.name })
  plan?: string | Plan;

  @Prop({ required: true })
  type: TransactionType;

  @Prop({ required: true })
  status: TransactionStatus;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  token: Hex;

  @Prop({ required: true })
  amountInUsd: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: undefined })
  dueDate?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ default: undefined })
  updatedAt?: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
