import { Hex } from "viem";
import {
  Network,
  TransactionRoute,
  TransactionStatus,
  TransactionType,
} from "./enums";

export type Token = {
  name: string;
  symbol: string;
  address: Hex;
  image: string;
  decimals: number;
  aToken: Hex;
  price: number;
};

export type Metadata = {
  schemaVersion: number;
  value: string;
};

export type TransactionCallback = Transaction & {
  session: string;
  route: TransactionRoute;
};

export type GetSubscription = {
  subscriptionId: Hex;
};

export type GetSubscriptionsHash = {
  transactionHash: Hex;
};

export type GetSubscriptions = {
  merchant: Hex;
  page: number;
  limit: number;
};

export type GetPayment = {
  transactionId: Hex;
};

export type GetPaymentHash = {
  transactionHash: Hex;
};

export type GetTransactions = {
  merchant: Hex;
  page: number;
  limit: number;
  payer?: Hex;
  amountMin?: number;
  amountMax?: number;
  timestampMin?: number;
  timestampMax?: number;
  status?: TransactionStatus;
};

export type GetMerchant = {
  merchant: Hex;
};

export type BeamSDKOptions = {
  network: Network;
  oracle?: Hex;
  timeout?: number;
  graphURL?: string;
  transactionURL?: string;
};

export type Merchant = {
  id: Hex;
  merchant: Hex;
  metadata_schemaVersion: number;
  metadata_value: string;
  wallet: Hex;
  tokens: Hex[];
  hook: Hex;
  signers: Hex[];
  minSigners: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: Hex;
};

export type Transaction = {
  id: Hex;
  transactionId: Hex;
  payer: Hex;
  payers: Hex[];
  fulfilleds: Hex[];
  merchant: Hex;
  token: Hex;
  amounts: bigint[];
  adjustedToken: Hex;
  adjustedAmount: bigint;
  dueDate: bigint;
  amount: bigint;
  timestamp: bigint;
  description: string;
  metadata_schemaVersion: number;
  metadata_value: string;
  status: TransactionStatus;
  type: TransactionType;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: Hex;
  confirmations: Confirmation[];
};

export type Confirmation = {
  id: Hex;
  transactionId: Hex;
  from: Hex;
  recipient: Hex;
  token: Hex;
  amount: bigint;
  adjustedToken: Hex;
  adjustedAmount: bigint;
  description: string;
  type: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: Hex;
};

export type Subscription = {
  id: Hex;
  subsciptionId: Hex;
  merchant: Hex;
  token: Hex;
  interval: number;
  amount: bigint;
  gracePeriod: number;
  description: string;
  trashed: boolean;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: Hex;
};
