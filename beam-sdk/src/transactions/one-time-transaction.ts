import { Endpoints } from "../utils/endpoints";
import { IOneTimeTransaction } from "../interfaces/one-time-transaction";
import {
  TransactionCallback,
  GetTransactions,
  Transaction,
  Metadata,
} from "../types";
import { BaseTransaction } from "./base";
import { TransactionType } from "../enums";
import { Hex } from "viem";

type CreateOneTimeTransaction = {
  payers: Hex[];
  merchant: Hex;
  amounts: bigint[];
  token: Hex;
  description: string;
  metadata: Metadata;
  mintReceipt: boolean;
};

type FulfillOneTimeTransaction = {
  transactionId: Hex;
  mintReceipt: boolean;
};
export class OneTimeTransaction
  extends BaseTransaction
  implements IOneTimeTransaction
{
  async create(params: CreateOneTimeTransaction): Promise<TransactionCallback> {
    return new Promise((resolve, reject) => {
      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          params,
          (data: TransactionCallback) => {
            if (data.session == session) {
              resolve(data);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async fulfill(
    params: FulfillOneTimeTransaction
  ): Promise<TransactionCallback> {
    return new Promise((resolve, reject) => {
      const paymentURL = Endpoints.BASE_TRANSACTION_URL;

      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          {
            data: params,
            target: paymentURL,
          },
          (data: TransactionCallback) => {
            if (data.session == session) {
              resolve(data);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  getOneTimeTransactions(params: GetTransactions): Promise<Transaction[]> {
    return this.graph.getTransactions(
      params.merchant,
      params.page,
      params.limit,
      params.payer,
      params.amountMin,
      params.amountMax,
      params.timestampMin,
      params.timestampMax,
      params.status,
      TransactionType.OneTime
    );
  }
}
