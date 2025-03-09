import { Endpoints } from "../utils/endpoints";
import {
  CancelRecurrentTransaction,
  CancelRecurrentTransactionCallback,
  CreateRecurrentTransaction,
  CreateRecurrentTransactionCallback,
  FulfillRecurrentTransaction,
  FulfillRecurrentTransactionCallback,
  GetTransactions,
  GetSubscription,
  GetSubscriptions,
  Transaction,
  Subscription,
} from "../types";
import { BaseTransaction } from "./base";
import { IRecurrentTransaction } from "../interfaces/recurrent-transaction";
import { TransactionType } from "../enums";

export class RecurrentTransaction
  extends BaseTransaction
  implements IRecurrentTransaction
{
  async create(
    params: CreateRecurrentTransaction
  ): Promise<CreateRecurrentTransactionCallback> {
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
          (data: CreateRecurrentTransactionCallback) => {
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
    params: FulfillRecurrentTransaction
  ): Promise<FulfillRecurrentTransactionCallback> {
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
          (data: FulfillRecurrentTransactionCallback) => {
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

  cancel(
    params: CancelRecurrentTransaction
  ): Promise<CancelRecurrentTransactionCallback> {
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
          (data: FulfillRecurrentTransactionCallback) => {
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

  getSubscription(params: GetSubscription): Promise<Subscription | null> {
    return this.graph.getSubscription(params.subscriptionId);
  }

  getSubscriptions(params: GetSubscriptions): Promise<Subscription[]> {
    return this.graph.getSubscriptions(
      params.merchant,
      params.page,
      params.limit
    );
  }

  getRecurrentTransactions(params: GetTransactions): Promise<Transaction[]> {
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
      TransactionType.Recurrent
    );
  }
}
