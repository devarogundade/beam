/* eslint-disable prettier/prettier */
import type {
  TransactionStatus,
  TransactionType,
} from '../../beam-sdk/src/enums';

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
  transactionId: Hex;
  merchant: Hex;
  buyer: Hex;
  product: ObjectId;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  token: Hex;
  amountInUsd: number;
  quantity: number;
};

export type CreateChat = {
  merchant: Hex;
  message: string;
};
