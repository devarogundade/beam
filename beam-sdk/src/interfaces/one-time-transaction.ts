import {
  PrepareFulfillOneTimeTransaction,
  PrepareOneTimeTransaction,
} from "../params";
import type {
  TransactionCallback,
  GetPayment,
  GetTransactions,
  Transaction,
  GetPaymentHash,
} from "../types";

export interface IOneTimeTransaction {
  create(params: PrepareOneTimeTransaction): Promise<TransactionCallback>;

  fulfill(
    params: PrepareFulfillOneTimeTransaction
  ): Promise<TransactionCallback>;

  getTransaction(params: GetPayment): Promise<Transaction | null>;

  getTransactions(params: GetTransactions): Promise<Transaction[]>;

  getTransactionsFromHash(params: GetPaymentHash): Promise<Transaction[]>;

  getOneTimeTransactions(params: GetTransactions): Promise<Transaction[]>;
}
