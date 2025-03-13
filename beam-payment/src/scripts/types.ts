import type { Hex } from "viem";

export type Token = {
  name: string;
  symbol: string;
  address: Hex;
  image: string;
  decimals: number;
};

export type Metadata = {
  schemaVersion: number;
  value: string;
};
