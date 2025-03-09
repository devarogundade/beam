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
} from './types';
import { Merchant } from './database/schemas/merchant';
import { Model, UpdateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BEAM_AI_KNOWLEDGE_BASE,
  BEAM_AI_REPORT_KNOWLEDGE_BASE,
  EVENTS_CONTRACT,
  SIMPLE_RECEIPT_CONTRACT,
} from './constants';
import { simpleReceiptAbi } from './abis/simple-receipt-abi';
import { publicClient } from './clients';
import { eventsAbi } from './abis/events-abi';
import { Product } from './database/schemas/product';
import { Sale } from './database/schemas/sales';
import { Chat } from './database/schemas/chat';
import { AppEvents } from './app.events';
import { Hex, zeroAddress } from 'viem';
import OpenAI from 'openai';
// import { tools } from './app.tools';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Merchant.name) private merchantModel: Model<Merchant>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {
    publicClient.watchContractEvent({
      address: SIMPLE_RECEIPT_CONTRACT,
      abi: simpleReceiptAbi,
      eventName: 'ReceiptMinted',
      onLogs: (logs) => {
        AppEvents.receiptMinted(logs);
      },
    });

    publicClient.watchContractEvent({
      address: EVENTS_CONTRACT,
      abi: eventsAbi,
      onLogs: (logs) => {
        console.log(EVENTS_CONTRACT, logs);
      },
    });
  }

  async chat(params: CreateChat): Promise<boolean> {
    try {
      await this.chatModel.create({
        from: params.merchant,
        to: zeroAddress,
        text: params.message,
        createdAt: new Date(),
      });

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const sales = JSON.stringify(
        await this.getSales(params.merchant, null, null, null),
      );

      const products = JSON.stringify(await this.getProducts(params.merchant));

      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'user', content: params.message },
          {
            role: 'user',
            content: `My merchant address is: ${params.merchant}.`,
          },
          { role: 'user', content: `My sales are: ${sales}.` },
          { role: 'user', content: `My products are: ${products}.` },
          { role: 'system', content: BEAM_AI_KNOWLEDGE_BASE },
          { role: 'system', content: BEAM_AI_REPORT_KNOWLEDGE_BASE },
        ],
        model: 'gpt-4o-mini',
      });

      await this.chatModel.create({
        from: zeroAddress,
        to: params.merchant,
        text: completion.choices[0].message.content,
        createdAt: new Date(),
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // async chat(params: CreateChat) {
  //   await this.chatModel.create({
  //     from: params.merchant,
  //     to: zeroAddress,
  //     text: params.message,
  //     createdAt: new Date(),
  //   });

  //   const openai = new OpenAI({
  //     apiKey: process.env.OPENAI_API_KEY,
  //   });

  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       { role: 'user', content: params.message },
  //       { role: 'user', content: `My merchant address is ${params.merchant}.` },
  //       { role: 'system', content: BEAM_AI_KNOWLEDGE_BASE },
  //     ],
  //     tools: tools,
  //     model: 'gpt-4o-mini',
  //   });

  //   const tool_calls = completion.choices[0].message.tool_calls;

  //   if (!tool_calls || tool_calls?.length == 0) {
  //     await this.chatModel.create({
  //       from: zeroAddress,
  //       to: params.merchant,
  //       text: completion.choices[0].message.content,
  //       createdAt: new Date(),
  //     });
  //     return;
  //   }

  //   let data: string = '';
  //   const tool_call = tool_calls[0];

  //   const args = JSON.parse(tool_call.function.arguments);

  //   switch (tool_call.function.name) {
  //     case 'getSales':
  //       data = JSON.stringify(
  //         await this.getSales(
  //           args.merchant,
  //           args.type,
  //           args.fromDate,
  //           args.toDate,
  //         ),
  //       );
  //       break;

  //     case 'getProducts':
  //       data = JSON.stringify(await this.getProducts(args.merchant));
  //       break;

  //     default:
  //       data = JSON.stringify({ message: 'No data' });
  //       break;
  //   }

  //   const completion2 = await openai.chat.completions.create({
  //     messages: [
  //       { role: 'user', content: params.message },
  //       { role: 'user', content: data },
  //       {
  //         role: 'system',
  //         content: BEAM_AI_REPORT_KNOWLEDGE_BASE,
  //       },
  //     ],
  //     model: 'gpt-4o-mini',
  //   });

  //   await this.chatModel.create({
  //     from: zeroAddress,
  //     to: params.merchant,
  //     text: completion2.choices[0].message.content,
  //     createdAt: new Date(),
  //   });
  // }

  async chats(merchant: string): Promise<Chat[]> {
    return this.chatModel.find({ $or: [{ from: merchant }, { to: merchant }] });
  }

  async updateWebhooks(params: UpdateWebhooks): Promise<any> {
    return this.merchantModel.updateOne(
      { address: params.merchant },
      {
        address: params.merchant,
        webhooks: params.webhooks,
      },
      {
        upsert: true,
      },
    );
  }

  async getWebhooks(merchant: Hex): Promise<string[]> {
    const data = await this.merchantModel.findOne({
      address: merchant,
    });

    return data ? data.webhooks : [];
  }

  async createProduct(params: CreateProduct): Promise<Product> {
    return this.productModel.create({
      merchant: params.merchant,
      name: params.name,
      description: params.description,
      images: params.images,
      category: params.category,
      quantity: params.quantity,
      sold: 0,
      available: true,
      amountInUsd: params.amountInUsd,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  async updateProduct(params: UpdateProduct): Promise<UpdateResult> {
    return this.productModel.updateOne(
      { _id: params.id, address: params.merchant },
      {
        name: params.name,
        description: params.description,
        images: params.images,
        category: params.category,
        quantity: params.quantity,
        available: params.available,
        amountInUsd: params.amountInUsd,
        updatedAt: new Date(),
      },
    );
  }

  async getProducts(merchant: Hex): Promise<Product[]> {
    return this.productModel.find({ merchant });
  }

  async createSale(params: CreateSale): Promise<Sale> {
    return this.saleModel.create({
      merchant: params.merchant,
      buyer: params.buyer,
      product: params.product,
      type: params.type,
      status: params.status,
      amount: params.amount,
      token: params.token,
      amountInUsd: params.amountInUsd,
      quantity: params.quantity,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  async getSales(
    merchant: Hex,
    type: string | null,
    fromDate: Date | null,
    toDate: Date | null,
  ): Promise<Sale[]> {
    const query: any = { merchant };

    if (type) query.type = type;
    if (toDate) query.createdAt = { ...query.createdAt, $lte: toDate };
    if (fromDate) query.createdAt = { ...query.createdAt, $gte: fromDate };

    return this.saleModel.find(query);
  }
}
