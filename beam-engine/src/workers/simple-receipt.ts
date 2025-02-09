/* eslint-disable prettier/prettier */

import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ReceiptOptions } from "src/types";

@Processor('SimpleReceiptWorker')
class SimpleReceiptWorker extends WorkerHost {
    // eslint-disable-next-line @typescript-eslint/require-await
    async process(job: Job<ReceiptOptions>): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const options = job.data;
    }
}

export default SimpleReceiptWorker;