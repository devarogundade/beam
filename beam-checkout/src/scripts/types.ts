import type { Hex } from "viem";

export type Notification = {
  title: string;
  description: string;
  category: string;
  linkTitle?: string;
  linkUrl?: string;
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
  sold: number;
  amountInUsd: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export type Plan = {
  _id: string;
  transactionHash: Hex;
  merchant: Hex;
  name: string;
  description: string;
  images: string[];
  category: string;
  gracePeriod: number;
  available: boolean;
  interval: number;
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
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateSale = {
  transactionId: Hex;
  merchant: Hex;
  buyer: Hex;
  product?: string;
  plan?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
  dueDate: Date | null;
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
