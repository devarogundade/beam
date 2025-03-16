/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Param, Query, Put } from '@nestjs/common';
import { AppService } from './app.service';
import {
  CreateChat,
  CreateMerchant,
  CreatePlan,
  CreateProduct,
  CreateSale,
  TransactionType,
  UpdateProduct,
  UpdateWebhooks,
} from './types';
import { Sale } from './database/schemas/sales';
import { Product } from './database/schemas/product';
import { UpdateResult } from 'mongoose';
import { Hex } from 'viem';
import { Chat } from './database/schemas/chat';
import { Merchant } from './database/schemas/merchant';
import { Plan } from './database/schemas/plan';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/chat')
  chat(@Body() params: CreateChat): Promise<boolean> {
    return this.appService.chat(params);
  }

  @Get('/chats/:merchant')
  chats(@Param('merchant') merchant: Hex): Promise<Chat[]> {
    return this.appService.chats(merchant);
  }

  @Get('/merchants/:merchant')
  getMerchant(@Param('merchant') merchant: Hex): Promise<Merchant | null> {
    return this.appService.getMerchant(merchant);
  }

  @Get('/products/:product')
  getProduct(@Param('product') id: string): Promise<Product | null> {
    return this.appService.getProduct(id);
  }

  @Get('/products/:plan')
  getPlan(@Param('plan') id: string): Promise<Plan | null> {
    return this.appService.getPlan(id);
  }

  @Post('/merchants/create')
  createMerchant(@Body() params: CreateMerchant): Promise<Merchant> {
    return this.appService.createMerchant(params);
  }

  @Post('/merchants/update-webhooks')
  updateWebhooks(@Body() params: UpdateWebhooks) {
    return this.appService.updateWebhooks(params);
  }

  @Post('/products/create')
  async createProduct(@Body() params: CreateProduct): Promise<Product> {
    return this.appService.createProduct(params);
  }

  @Post('/plans/create')
  async createPlan(@Body() params: CreatePlan): Promise<Plan> {
    return this.appService.createPlan(params);
  }

  @Put('/products/update')
  async updateProduct(@Body() params: UpdateProduct): Promise<UpdateResult> {
    return this.appService.updateProduct(params);
  }

  @Get('/products')
  getProducts(@Query('merchant') merchant: Hex): Promise<Product[]> {
    return this.appService.getProducts(merchant);
  }

  @Get('/plans')
  getPlans(@Query('merchant') merchant: Hex): Promise<Plan[]> {
    return this.appService.getPlans(merchant);
  }

  @Post('/sales/create')
  async createSale(@Body() params: CreateSale): Promise<Sale> {
    return this.appService.createSale(params);
  }

  @Get('/sales')
  getSales(
    @Query('merchant') merchant: Hex,
    @Query('type') type: TransactionType | null,
    @Query('from_date') fromDate: Date | null,
    @Query('from_date') toDate: Date | null,
  ): Promise<Sale[]> {
    return this.appService.getSales(merchant, type, fromDate, toDate);
  }
}
