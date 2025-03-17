import {
  PrepareCancelRecurrentTransaction,
  PrepareFulfillRecurrentTransaction,
  PrepareRecurrentTransaction,
} from "../params";
import type {
  TransactionCallback,
  Transaction,
  GetTransactions,
  GetTransaction,
  Subscription,
  GetSubscription,
  GetSubscriptions,
  GetTransactionHash,
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

  getTransaction(params: GetTransaction): Promise<Transaction | null>;

  getTransactions(params: GetTransactions): Promise<Transaction[]>;

  getTransactionsFromHash(params: GetTransactionHash): Promise<Transaction[]>;

  getRecurrentTransactions(params: GetTransactions): Promise<Transaction[]>;
}
