/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Hex } from 'viem';

export type MerchantDocument = HydratedDocument<Merchant>;

@Schema()
export class Merchant {
  @Prop({ required: true, unique: true })
  address: Hex;

  @Prop({ type: Types.Array })
  webhooks: string[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
