import { type Hex } from "viem";
import type { Metadata } from "./types";

export type CreateMerchant = {
  metadata: Metadata;
  tokens: Hex[];
  signers: Hex[];
  minSigners: number;
};

export type UpdateMerchant = {
  metadata: Metadata;
};

export type CreateSubscription = {
  token: Hex;
  interval: number;
  amount: BigInt;
  gracePeriod: number;
  description: string;
};

export type UpdateSubscription = {
  subscriptionId: Hex;
  amount: BigInt;
  gracePeriod: number;
  description: string;
  active: boolean;
};

export type DeleteSubscription = {
  subscriptionId: Hex;
};

export type RegisterHook = {
  hook: Hex;
};
