/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Hex } from 'viem';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ required: true })
  from: Hex;

  @Prop({ required: true })
  to: Hex;

  @Prop({ default: undefined })
  text?: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
