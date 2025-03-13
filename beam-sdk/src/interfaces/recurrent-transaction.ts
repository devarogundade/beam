import {
  CancelRecurrentTransaction,
  CreateRecurrentTransaction,
  CreateRecurrentTransactionCallback,
  FulfillRecurrentTransaction,
  FulfillRecurrentTransactionCallback,
  Transaction,
  CancelRecurrentTransactionCallback,
  GetTransactions,
  GetPayment,
  Subscription,
  GetSubscription,
  GetSubscriptions,
} from "../types";

export interface IRecurrentTransaction {
  create(
    params: CreateRecurrentTransaction
  ): Promise<CreateRecurrentTransactionCallback>;

  fulfill(
    params: FulfillRecurrentTransaction
  ): Promise<FulfillRecurrentTransactionCallback>;

  cancel(
    params: CancelRecurrentTransaction
  ): Promise<CancelRecurrentTransactionCallback>;

  getSubscription(params: GetSubscription): Promise<Subscription | null>;

  getSubscriptions(params: GetSubscriptions): Promise<Subscription[]>;

  getTransaction(params: GetPayment): Promise<Transaction | null>;

  getTransactions(params: GetTransactions): Promise<Transaction[]>;

  getTransactionsFromHash(params: GetPayment): Promise<Transaction[]>;

  getRecurrentTransactions(params: GetTransactions): Promise<Transaction[]>;
}
