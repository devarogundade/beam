/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { HexString } from 'src/types';

export type MerchantDocument = HydratedDocument<Merchant>;

@Schema()
export class Merchant {
    @Prop({ required: true, unique: true })
    address: HexString;

    @Prop({ type: Types.Array })
    webhooks: string[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
