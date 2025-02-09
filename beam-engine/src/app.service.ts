/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { HexString, UpdaeWebhooks } from './types';
import { Merchant } from './database/schemas/merchant';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EVENTS_CONTRACT, SIMPLE_RECEIPT_CONTRACT } from './constants';
import { simpleReceiptAbi } from './abis/simple-receipt-abi';
import { publicClient } from './clients';
import { eventsAbi } from './abis/events-abi';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Merchant.name) private merchantModel: Model<Merchant>) {
    this.watchEvents();
  }

  private watchEvents() {
    publicClient.watchContractEvent({
      address: SIMPLE_RECEIPT_CONTRACT,
      abi: simpleReceiptAbi,
      eventName: 'ReceiptMinted',
      onLogs: logs => { this.receiptMinted(logs); }
    });

    publicClient.watchContractEvent({
      address: EVENTS_CONTRACT,
      abi: eventsAbi,
      onLogs: logs => {
        console.log(EVENTS_CONTRACT, logs);
      }
    });
  }

  private receiptMinted(logs: any) {
    console.log("receiptMinted", logs);
  }

  private oneTimePaymentCreated(logs: any) {
    console.log("oneTimePaymentCreated", logs);
  }

  private oneTimePaymentFulfilled(logs: any) {
    console.log("oneTimePaymentFulfilled", logs);
  }

  private recurrentPaymentCreated(logs: any) {
    console.log("recurrentPaymentCreated", logs);
  }

  private recurrentPaymentFulfilled(logs: any) {
    console.log("recurrentPaymentFulfilled", logs);
  }

  private recurrentPaymentCancelled(logs: any) {
    console.log("recurrentPaymentCancelled", logs);
  }

  async updateWebhooks(params: UpdaeWebhooks): Promise<any> {
    return this.merchantModel.updateOne(
      { address: params.merchant },
      {
        address: params.merchant,
        webhooks: params.webhooks
      },
      {
        upsert: true,
      }
    );
  }

  async getWebhooks(merchant: HexString): Promise<string[]> {
    const data = await this.merchantModel.findOne({
      address: merchant
    });

    return data ? data.webhooks : [];
  }
}
