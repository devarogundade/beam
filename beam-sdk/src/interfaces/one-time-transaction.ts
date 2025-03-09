import {
  CreateOneTimeTransaction,
  CreateOneTimeTransactionCallback,
  FulfillOneTimeTransaction,
  FulfillOneTimeTransactionCallback,
  GetPayment,
  GetTransactions,
  Transaction,
} from "../types";

export interface IOneTimeTransaction {
  create(
    params: CreateOneTimeTransaction
  ): Promise<CreateOneTimeTransactionCallback>;

  fulfill(
    params: FulfillOneTimeTransaction
  ): Promise<FulfillOneTimeTransactionCallback>;

  getTransaction(params: GetPayment): Promise<Transaction | null>;

  getTransactions(params: GetTransactions): Promise<Transaction[]>;

  getOneTimeTransactions(params: GetTransactions): Promise<Transaction[]>;
}
