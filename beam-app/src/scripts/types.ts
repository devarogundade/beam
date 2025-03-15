import type { Hex } from "viem";

export enum Connection {
  Wallet,
  Guest,
}

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: Hex;
  image: string;
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

export type ClientMerchant = {
  address: Hex;
  webhooks: string[];
};

export type CreateMerchant = {
  merchant: Hex;
  webhooks: string[];
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
  merchant: Hex;
  buyer: Hex;
  product: Product | null;
  type: string;
  status: string;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
};

export type Chat = {
  _id: string;
  from: Hex;
  to: Hex;
  text?: string;
  createdAt: Date;
};
