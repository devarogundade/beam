import type { Hex } from "viem";
import type { Metadata } from "./types";

export type CreateOneTimeTransaction = {
  payers: Hex[];
  merchant: Hex;
  amounts: bigint[];
  token: Hex;
  tokenB: Hex;
  description: string;
  metadata: Metadata;
  mintReceipt: boolean;
  healthFactorMultiplier: bigint;
  route: TransactionRoute;
  signature: Signature;
};

export type FulfillOneTimeTransaction = {
  transactionId: Hex;
  tokenB: Hex;
  mintReceipt: boolean;
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
  mintReceipt: boolean;
  healthFactorMultiplier: bigint;
  route: TransactionRoute;
  signature: Signature;
};

export type FulfillRecurrentTransaction = {
  transactionId: Hex;
  tokenB: Hex;
  mintReceipt: boolean;
  healthFactorMultiplier: bigint;
  route: TransactionRoute;
  signature: Signature;
};

export type CancelRecurrentTransaction = {
  transactionId: Hex;
};

export enum TransactionRoute {
  None,
  Uniswap,
  Aave,
}

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
};
