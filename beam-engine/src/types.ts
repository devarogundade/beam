/* eslint-disable prettier/prettier */

import { ObjectId } from 'mongoose';
import { Hex } from 'viem';

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

export type UpdateProduct = {
  id: ObjectId;
  merchant: Hex;
  name: string;
  description: string;
  images: string[];
  category: string;
  quantity: number;
  amountInUsd: number;
  available: boolean;
};

export type CreateSale = {
  merchant: Hex;
  buyer: Hex;
  product: ObjectId;
  type: string;
  status: string;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
};

export type CreateChat = {
  merchant: Hex;
  message: string;
};
