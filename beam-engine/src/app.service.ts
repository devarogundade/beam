/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import {
  CreateProduct,
  CreateChat,
  CreateSale,
  UpdateProduct,
  UpdateWebhooks,
  CreateMerchant,
  CreatePlan,
  TransactionType,
  ClientMerchant,
  WebhookOptions,
} from './types';
import { Merchant } from './database/schemas/merchant';
import { Model, UpdateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BEAM_AI_KNOWLEDGE_BASE,
  BEAM_AI_REPORT_KNOWLEDGE_BASE,
  EVENTS_CONTRACT,
} from './constants';
import { publicClient } from './clients';
import { eventsAbi } from './abis/events-abi';
import { Product } from './database/schemas/product';
import { Sale } from './database/schemas/sales';
import { Chat } from './database/schemas/chat';
import { Hex, zeroAddress } from 'viem';
import OpenAI from 'openai';
import { Plan } from './database/schemas/plan';
import WebhookWorker from './workers/webhook';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(WebhookWorker.name) private webhookWorkerQueue: Queue,
    @InjectModel(Merchant.name) private merchantModel: Model<Merchant>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,
  ) {
    publicClient.watchContractEvent({
      address: EVENTS_CONTRACT,
      abi: eventsAbi,
      onLogs: (events) => {
        const options: WebhookOptions = {
          events,
        };

        this.webhookWorkerQueue
          .add(`event-${Date.now()}`, options)
          .catch((error) => {
            console.log(error);
          });
      },
    });
  }

  async chat(params: CreateChat): Promise<boolean> {
    try {
      await this.chatModel.create({
        from: params.merchant.toLowerCase(),
        to: zeroAddress,
        text: params.message,
        createdAt: new Date(),
      });

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const profile = JSON.stringify(
        await this.getMerchant(params.merchant, true),
      );

      const sales = JSON.stringify(
        await this.getSales(params.merchant, null, null, null),
      );

      const products = JSON.stringify(await this.getProducts(params.merchant));

      const plans = JSON.stringify(await this.getPlans(params.merchant));

      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'user', content: params.message },
          {
            role: 'system',
            content: `Merchant address is: ${params.merchant.toLowerCase()}.`,
          },
          { role: 'system', content: `Profile is: ${profile}.` },
          { role: 'system', content: `Sales are: ${sales}.` },
          { role: 'system', content: `Products are: ${products}.` },
          { role: 'system', content: `Plans are: ${plans}.` },
          { role: 'system', content: BEAM_AI_KNOWLEDGE_BASE },
          { role: 'system', content: BEAM_AI_REPORT_KNOWLEDGE_BASE },
        ],
        model: 'gpt-4o-mini',
      });

      await this.chatModel.create({
        from: zeroAddress,
        to: params.merchant.toLowerCase(),
        text: completion.choices[0].message.content,
        createdAt: new Date(),
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async chats(merchant: string): Promise<Chat[]> {
    return this.chatModel.find({
      $or: [{ from: merchant.toLowerCase() }, { to: merchant.toLowerCase() }],
    });
  }

  async createMerchant(params: CreateMerchant): Promise<Merchant> {
    return this.merchantModel.create({
      address: params.merchant.toLowerCase(),
      webhooks: params.webhooks,
    });
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.productModel.findOne({
      _id: id,
    });
  }

  async getPlan(id: string): Promise<Plan | null> {
    return this.planModel.findOne({
      _id: id,
    });
  }

  async getMerchant(
    merchant: Hex,
    simple: boolean = false,
  ): Promise<Merchant | ClientMerchant | null> {
    const data = await this.merchantModel.findOne({
      address: merchant.toLowerCase(),
    });

    if (!data) return null;
    if (simple) return data;

    const productSales = await this.getSales(
      merchant,
      TransactionType.OneTime,
      null,
      null,
    );
    const planSales = await this.getSales(
      merchant,
      TransactionType.Recurrent,
      null,
      null,
    );
    const products = await this.getProducts(merchant);
    const plans = await this.getPlans(merchant);

    return {
      address: data.address,
      webhooks: data.webhooks,
      productsCount: products.length,
      plansCount: plans.length,
      productSalesInUsd: productSales.reduce((a, b) => a + b.amountInUsd, 0),
      productSalesCount: productSales.length,
      planSalesInUsd: planSales.reduce((a, b) => a + b.amountInUsd, 0),
      planSalesCount: planSales.length,
    };
  }

  async updateWebhooks(params: UpdateWebhooks): Promise<any> {
    return this.merchantModel.updateOne(
      { address: params.merchant.toLowerCase() },
      {
        address: params.merchant.toLowerCase(),
        webhooks: params.webhooks,
      },
      {
        upsert: true,
      },
    );
  }

  async createProduct(params: CreateProduct): Promise<Product> {
    return this.productModel.create({
      merchant: params.merchant.toLowerCase(),
      name: params.name,
      description: params.description,
      images: params.images,
      category: params.category,
      quantity: params.quantity,
      sold: 0,
      amountInUsd: params.amountInUsd,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  async createPlan(params: CreatePlan): Promise<Plan> {
    return this.planModel.create({
      transactionHash: params.transactionHash,
      merchant: params.merchant.toLowerCase(),
      name: params.name,
      description: params.description,
      images: params.images,
      category: params.category,
      sold: 0,
      interval: params.interval,
      gracePeriod: params.gracePeriod,
      amount: params.amount,
      token: params.token,
      available: true,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  async updateProduct(params: UpdateProduct): Promise<UpdateResult> {
    return this.productModel.updateOne(
      { _id: params.id, address: params.merchant.toLowerCase() },
      {
        name: params.name,
        description: params.description,
        images: params.images,
        category: params.category,
        quantity: params.quantity,
        amountInUsd: params.amountInUsd,
        updatedAt: new Date(),
      },
    );
  }

  async getProducts(merchant: Hex): Promise<Product[]> {
    return this.productModel.find({ merchant: merchant.toLowerCase() });
  }

  async getPlans(merchant: Hex): Promise<Plan[]> {
    return this.planModel.find({ merchant: merchant.toLowerCase() });
  }

  async createSale(params: CreateSale): Promise<Sale> {
    if (params.type == TransactionType.OneTime) {
      await this.productModel.findOneAndUpdate(
        { _id: params.product },
        {
          $inc: {
            quantity: -1 * params.quantity,
            sold: params.quantity,
          },
        },
      );
    } else if (params.type == TransactionType.Recurrent) {
      await this.planModel.findOneAndUpdate(
        { _id: params.plan },
        {
          $inc: {
            sold: 1,
          },
        },
      );
    }

    return this.saleModel.findOneAndUpdate(
      { transactionId: params.transactionId },
      {
        transactionId: params.transactionId,
        merchant: params.merchant.toLowerCase(),
        buyer: params.buyer,
        product: params.product,
        plan: params.plan,
        type: params.type,
        status: params.status,
        amount: params.amount,
        token: params.token,
        amountInUsd: params.amountInUsd,
        quantity: params.quantity,
        dueDate: params.dueDate,
        createdAt: new Date(),
        updatedAt: null,
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async getSales(
    merchant: Hex,
    type: TransactionType | null,
    fromDate: Date | null,
    toDate: Date | null,
  ): Promise<Sale[]> {
    const query: any = { merchant: merchant.toLowerCase() };

    if (type) query.type = type;
    if (toDate) query.createdAt = { ...query.createdAt, $lte: toDate };
    if (fromDate) query.createdAt = { ...query.createdAt, $gte: fromDate };

    return this.saleModel.find(query).populate(['product', 'plan']).exec();
  }
}
