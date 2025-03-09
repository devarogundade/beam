/* eslint-disable prettier/prettier */

import { AxiosResponse } from 'axios';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Merchant } from 'src/database/schemas/merchant';
import { WebhookOptions } from 'src/types';
import { HttpService } from '@nestjs/axios';

@Processor('WebhookWorker')
class WebhookWorker extends WorkerHost {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Merchant.name) private merchantModel: Model<Merchant>,
  ) {
    super();
  }

  async process(job: Job<WebhookOptions>): Promise<any> {
    const options = job.data;

    const merchant = await this.merchantModel.findOne({
      address: options.merchant,
    });

    if (!merchant || merchant.webhooks.length == 0) {
      return await job.moveToCompleted(null, '');
    }

    const requests: Promise<AxiosResponse<any, any>>[] = [];

    for (let index = 0; index < merchant.webhooks.length; index++) {
      const urlEnpoint = merchant.webhooks[index];
      requests.push(this.httpService.axiosRef.post(urlEnpoint, options.event));
    }

    await Promise.all(requests);
  }

  @OnWorkerEvent('completed')
  onCompleted() {}
}

export default WebhookWorker;
