import {
  PrepareCancelRecurrentTransaction,
  PrepareFulfillRecurrentTransaction,
  PrepareRecurrentTransaction,
} from "../params";
import type {
  TransactionCallback,
  Transaction,
  GetTransactions,
  GetPayment,
  Subscription,
  GetSubscription,
  GetSubscriptions,
  GetPaymentHash,
  GetSubscriptionsHash,
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

  getSubscriptionFromHash(
    params: GetSubscriptionsHash
  ): Promise<Subscription[]>;

  getSubscriptions(params: GetSubscriptions): Promise<Subscription[]>;

  getTransaction(params: GetPayment): Promise<Transaction | null>;

  getTransactions(params: GetTransactions): Promise<Transaction[]>;

  getTransactionsFromHash(params: GetPaymentHash): Promise<Transaction[]>;

  getRecurrentTransactions(params: GetTransactions): Promise<Transaction[]>;
}
