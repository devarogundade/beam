/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import WebhookWorker from './workers/webhook';
import SimpleReceiptWorker from './workers/simple-receipt';
import { Merchant, MerchantSchema } from './database/schemas/merchant';

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
        tls: {}
      }
    }),
    BullModule.registerQueue({ name: 'SimpleReceiptWorker' }),
    BullModule.registerQueue({ name: 'WebhookWorker' }),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
    ])

  ],
  controllers: [AppController],
  providers: [SimpleReceiptWorker, WebhookWorker, AppService],
})
export class AppModule { }
