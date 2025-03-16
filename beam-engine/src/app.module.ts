/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import WebhookWorker from './workers/webhook';
import { Merchant, MerchantSchema } from './database/schemas/merchant';
import { Product, ProductSchema } from './database/schemas/product';
import { Sale, SaleSchema } from './database/schemas/sales';
import { Chat, ChatSchema } from './database/schemas/chat';
import { Plan, PlanSchema } from './database/schemas/plan';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        username: process.env.REDIS_USERNAME,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        connectTimeout: 10000,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        tls: {},
      },
    }),
    BullModule.registerQueue({ name: 'SimpleReceiptWorker' }),
    BullModule.registerQueue({ name: 'WebhookWorker' }),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Sale.name, schema: SaleSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Plan.name, schema: PlanSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [WebhookWorker, AppService],
})
export class AppModule {}
