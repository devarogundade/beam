/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { HexString, UpdaeWebhooks } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/update-webhooks')
  updateWebhooks(@Body() params: UpdaeWebhooks) {
    return this.appService.updateWebhooks(params);
  }

  @Get('/get-webhooks/:merchant')
  getWebhooks(@Param('merchant') merchant: HexString): Promise<string[]> {
    return this.appService.getWebhooks(merchant);
  }
}
