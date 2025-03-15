import { Endpoints } from "../utils/endpoints";
import { IOneTimeTransaction } from "../interfaces/one-time-transaction";
import { TransactionCallback, GetTransactions, Transaction } from "../types";
import { BaseTransaction } from "./base";
import { TransactionType } from "../enums";
import {
  PrepareFulfillOneTimeTransaction,
  PrepareOneTimeTransaction,
} from "src/params";

export class OneTimeTransaction
  extends BaseTransaction
  implements IOneTimeTransaction
{
  async create(
    params: PrepareOneTimeTransaction
  ): Promise<TransactionCallback> {
    return new Promise((resolve, reject) => {
      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      const paymentParams = { ...params, type: TransactionType.OneTime };

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          paymentParams,
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
    params: PrepareFulfillOneTimeTransaction
  ): Promise<TransactionCallback> {
    return new Promise((resolve, reject) => {
      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      const paymentParams = { ...params, type: TransactionType.OneTime };

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          paymentParams,
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
