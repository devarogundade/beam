import { Endpoints } from "../utils/endpoints";
import { IOneTimeTransaction } from "../interfaces/one-time-transaction";
import {
  CreateOneTimeTransaction,
  CreateOneTimeTransactionCallback,
  FulfillOneTimeTransaction,
  FulfillOneTimeTransactionCallback,
  GetTransactions,
  Transaction,
} from "../types";
import { BaseTransaction } from "./base";
import { TransactionType } from "../enums";

export class OneTimeTransaction
  extends BaseTransaction
  implements IOneTimeTransaction
{
  async create(
    params: CreateOneTimeTransaction
  ): Promise<CreateOneTimeTransactionCallback> {
    return new Promise((resolve, reject) => {
      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          params,
          (data: CreateOneTimeTransactionCallback) => {
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
  ): Promise<FulfillOneTimeTransactionCallback> {
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
          (data: FulfillOneTimeTransactionCallback) => {
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
