import type { Hex } from "viem";

export enum TransactionType {
  OneTime = 0,
  Recurrent = 1,
}

export enum TransactionStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum Connection {
  Wallet,
  Guest,
}

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: Hex;
};

export type Metadata = {
  schemaVersion: number;
  value: string;
};

export type Product = {
  _id: string;
  merchant: Hex;
  name: string;
  description: string;
  images: string[];
  category: string;
  quantity: number;
  available: boolean;
  sold: number;
  amountInUsd: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export type Sale = {
  _id: string;
  merchant: Hex;
  buyer: Hex;
  product: Product | null;
  type: string;
  status: SaleStatus;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export enum SaleStatus {
  Pending,
  Completed,
}
