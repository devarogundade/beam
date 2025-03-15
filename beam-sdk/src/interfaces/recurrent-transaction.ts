import {
  PrepareCancelRecurrentTransaction,
  PrepareFulfillRecurrentTransaction,
  PrepareRecurrentTransaction,
} from "src/params";
import {
  TransactionCallback,
  Transaction,
  GetTransactions,
  GetPayment,
  Subscription,
  GetSubscription,
  GetSubscriptions,
  GetPaymentHash,
} from "../types";

export interface IRecurrentTransaction {
  create(params: PrepareRecurrentTransaction): Promise<TransactionCallback>;

  fulfill(
    params: PrepareFulfillRecurrentTransaction
  ): Promise<TransactionCallback>;

  cancel(
    params: PrepareCancelRecurrentTransaction
  ): Promise<TransactionCallback>;

  getSubscription(params: GetSubscription): Promise<Subscription | null>;

  getSubscriptions(params: GetSubscriptions): Promise<Subscription[]>;

  getTransaction(params: GetPayment): Promise<Transaction | null>;

  getTransactions(params: GetTransactions): Promise<Transaction[]>;

  getTransactionsFromHash(params: GetPaymentHash): Promise<Transaction[]>;

  getRecurrentTransactions(params: GetTransactions): Promise<Transaction[]>;
}
