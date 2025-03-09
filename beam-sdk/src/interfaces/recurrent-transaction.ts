import {
  CancelRecurrentTransaction,
  CreateRecurrentTransaction,
  CreateRecurrentTransactionCallback,
  FulfillRecurrentTransaction,
  FulfillRecurrentTransactionCallback,
  Payment,
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

  getTransaction(params: GetPayment): Promise<Payment | null>;

  getTransactions(params: GetTransactions): Promise<Payment[]>;

  getRecurrentTransactions(params: GetTransactions): Promise<Payment[]>;
}
