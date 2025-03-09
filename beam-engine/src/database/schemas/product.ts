/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Hex } from 'viem';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true })
  merchant: Hex;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.Array })
  images: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  available: boolean;

  @Prop({ required: true })
  sold: number;

  @Prop({ required: true })
  amountInUsd: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ default: undefined })
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
