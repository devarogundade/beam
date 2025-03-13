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

export enum TransactionRoute {
  None,
  Uniswap,
  Aave,
}

export type Signature = {
  deadline: number;
  v: number;
  r: Hex;
  s: Hex;
};

export type MintReceipt = { to: Hex; transactionId: Hex };
