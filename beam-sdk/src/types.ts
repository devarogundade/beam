import { Hex } from "viem";
import { Network, PaymentStatus, PaymentType } from "./enums";

export type Metadata = {
  schemaVersion: number;
  value: string;
};

export type CreateOneTimePayment = {
  payers: Hex[];
  merchant: Hex;
  amounts: bigint[];
  token: Hex;
  description: string;
  metadata: Metadata;
  mintReceipt: boolean;
};

export type FulfillOneTimePayment = {
  paymentId: Hex;
  mintReceipt: boolean;
};

export type CreateOneTimePaymentCallback = Payment & {
  session: string;
};

export type FulfillOneTimePaymentCallback = Payment & {
  session: string;
};

export type CreateRecurrentPayment = {
  merchant: Hex;
  subscriptionId: Hex;
  description: string;
  metadata: Metadata;
  mintReceipt: boolean;
};

export type FulfillRecurrentPayment = {
  paymentId: Hex;
  subscriptionId: Hex;
  mintReceipt: boolean;
};

export type CancelRecurrentPayment = {
  paymentId: Hex;
  subscriptionId: Hex;
};

export type CreateRecurrentPaymentCallback = Payment & {
  session: string;
};

export type FulfillRecurrentPaymentCallback = Payment & {
  session: string;
};

export type CancelRecurrentPaymentCallback = Payment & {
  session: string;
};

export type GetSubscription = {
  subscriptionId: Hex;
};

export type GetSubscriptions = {
  merchant: Hex;
  page: number;
  limit: number;
};

export type GetPayment = {
  paymentId: Hex;
};

export type GetPayments = {
  merchant: Hex;
  page: number;
  limit: number;
  payer?: Hex;
  amountMin?: number;
  amountMax?: number;
  timestampMin?: number;
  timestampMax?: number;
  status?: PaymentStatus;
};

export type GetMerchant = {
  merchant: Hex;
};

export type BeamSDKOptions = {
  network: Network;
  oracle?: Hex;
  timeout?: number;
  graphURL?: string;
  paymentURL?: string;
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

export type Payment = {
  id: Hex;
  paymentId: Hex;
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
  status: PaymentStatus;
  type: PaymentType;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: Hex;
};

export type Transaction = {
  id: Hex;
  paymentId: Hex;
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
  interval: number;
  amount: bigint;
  gracePeriod: number;
  description: string;
  trashed: boolean;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: Hex;
};

export type WithdrawRequest = {
  id: Hex;
  merchant: Hex;
  requestId: number;
  token: Hex;
  amount: bigint;
  recipient: Hex;
  signers: Hex[];
  fulfilleds: Hex[];
  executed: boolean;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: Hex;
};
