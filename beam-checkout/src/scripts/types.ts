import type { Hex } from "viem";

export enum Connection {
  Wallet,
  Guest,
}

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
  transactionId: Hex;
  merchant: Hex;
  buyer: Hex;
  product: Product | null;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateProduct = {
  merchant: Hex;
  name: string;
  description: string;
  images: string[];
  category: string;
  quantity: number;
  amountInUsd: number;
};

export type CreateSale = {
  transactionId: Hex;
  merchant: Hex;
  buyer: Hex;
  product: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
};

export enum TransactionStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum TransactionType {
  OneTime = 0,
  Recurrent = 1,
  Send = 2,
}

export enum TransactionRoute {
  None = 0,
  Uniswap = 1,
  Aave = 2,
}

export enum Network {
  Testnet = "Testnet",
}
