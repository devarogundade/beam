/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Hex } from 'viem';

export type PlanDocument = HydratedDocument<Plan>;

@Schema()
export class Plan {
  @Prop({ required: true })
  transactionHash: Hex;

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
  interval: number;

  @Prop({ required: true })
  gracePeriod: number;

  @Prop({ required: true })
  available: boolean;

  @Prop({ required: true })
  sold: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  token: Hex;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ default: undefined })
  updatedAt?: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
