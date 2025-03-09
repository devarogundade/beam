/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Param, Query, Put } from '@nestjs/common';
import { AppService } from './app.service';
import {
  CreateChat,
  CreateProduct,
  CreateSale,
  UpdateProduct,
  UpdateWebhooks,
} from './types';
import { Sale } from './database/schemas/sales';
import { Product } from './database/schemas/product';
import { UpdateResult } from 'mongoose';
import { Hex } from 'viem';
import { Chat } from './database/schemas/chat';

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

  @Post('/update-webhooks')
  updateWebhooks(@Body() params: UpdateWebhooks) {
    return this.appService.updateWebhooks(params);
  }

  @Get('/get-webhooks/:merchant')
  getWebhooks(@Param('merchant') merchant: Hex): Promise<string[]> {
    return this.appService.getWebhooks(merchant);
  }

  @Post('/products/create')
  async createProduct(@Body() params: CreateProduct): Promise<Product> {
    return this.appService.createProduct(params);
  }

  @Put('/products/update')
  async updateProduct(@Body() params: UpdateProduct): Promise<UpdateResult> {
    return this.appService.updateProduct(params);
  }

  @Get('/products')
  getProducts(@Query('merchant') merchant: Hex): Promise<Product[]> {
    return this.appService.getProducts(merchant);
  }

  @Post('/sales/create')
  async createSale(@Body() params: CreateSale): Promise<Sale> {
    return this.appService.createSale(params);
  }

  @Get('/sales')
  getSales(
    @Query('merchant') merchant: Hex,
    @Query('type') type: string | null,
    @Query('from_date') fromDate: Date | null,
    @Query('from_date') toDate: Date | null,
  ): Promise<Sale[]> {
    return this.appService.getSales(merchant, type, fromDate, toDate);
  }
}
