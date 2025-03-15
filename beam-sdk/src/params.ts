import type { Hex } from "viem";
import type { Metadata } from "./types";
import { TransactionRoute } from "./enums";

export type PrepareOneTimeTransaction = {
  payers: Hex[];
  merchant: Hex;
  amounts: bigint[];
  token: Hex;
  description: string;
  metadata: Metadata;
};

export type PrepareFulfillOneTimeTransaction = {
  transactionId: Hex;
};

export type PrepareRecurrentTransaction = {
  merchant: Hex;
  subscriptionId: Hex;
  description: string;
  metadata: Metadata;
};

export type PrepareFulfillRecurrentTransaction = {
  transactionId: Hex;
  subscriptionId: Hex;
};

export type PrepareCancelRecurrentTransaction = {
  transactionId: Hex;
  subscriptionId: Hex;
};

export type CreateOneTimeTransaction = {
  payers: Hex[];
  merchant: Hex;
  amounts: bigint[];
  token: Hex;
  tokenB: Hex;
  description: string;
  metadata: Metadata;
  slippage: bigint;
  healthFactorMultiplier: bigint;
  route: TransactionRoute;
  signature: Signature;
};

export type FulfillOneTimeTransaction = {
  transactionId: Hex;
  tokenB: Hex;
  healthFactorMultiplier: bigint;
  route: TransactionRoute;
  signature: Signature;
};

export type CreateRecurrentTransaction = {
  merchant: Hex;
  tokenB: Hex;
  subscriptionId: Hex;
  description: string;
  metadata: Metadata;
  slippage: bigint;
  healthFactorMultiplier: bigint;
  route: TransactionRoute;
  signature: Signature;
};

export type FulfillRecurrentTransaction = {
  transactionId: Hex;
  tokenB: Hex;
  slippage: bigint;
  healthFactorMultiplier: bigint;
  route: TransactionRoute;
  signature: Signature;
};

export type CancelRecurrentTransaction = {
  transactionId: Hex;
};

export type Signature = {
  deadline: number;
  v: bigint;
  r: Hex;
  s: Hex;
};

export type MintReceipt = { to: Hex; transactionId: Hex };

export type RequiredSupplyMin = {
  payer: Hex;
  borrowAsset: Hex;
  borrowAmount: bigint;
  supplyAsset: Hex;
  healthFactorMultiplier: bigint;
};

export type RequiredAmountIn = {
  tokenIn: Hex;
  tokenOut: Hex;
  amountOut: bigint;
  slippage: bigint;
};
