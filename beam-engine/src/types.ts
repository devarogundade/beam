/* eslint-disable prettier/prettier */

import { ObjectId } from 'mongoose';
import { Hex } from 'viem';

export type ClientMerchant = {
  address: Hex;
  webhooks: string[];
  productsCount: number;
  plansCount: number;
  productSalesInUsd: number;
  productSalesCount: number;
  planSalesInUsd: number;
  planSalesCount: number;
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

export type WebhookOptions = {
  merchant: Hex;
  event: any;
};

export type ReceiptOptions = {
  payer: Hex;
  token: Hex;
  amount: bigint;
  tokenId: number;
  timestamp: number;
  transactionId: Hex;
  transactionHash: Hex;
};

export type CreateMerchant = {
  merchant: Hex;
  webhooks: string[];
};

export type UpdateWebhooks = {
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

export type CreatePlan = {
  transactionHash: Hex;
  merchant: Hex;
  name: string;
  description: string;
  images: string[];
  category: string;
  interval: number;
  gracePeriod: number;
  amount: number;
  token: Hex;
};

export type UpdateProduct = {
  id: ObjectId;
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
  product: ObjectId;
  plan: ObjectId;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
  dueDate: Date | null;
};

export type CreateChat = {
  merchant: Hex;
  message: string;
};
