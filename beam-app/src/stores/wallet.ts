import { Connection } from "@/scripts/types";
import { defineStore } from "pinia";
import type { Hex } from "viem";

interface Signer {
  address: Hex;
  name: string;
}

interface MerchantJSON {
  name: string;
  image: File | null;
  imageURL: string | null;
  signers: Signer[];
  threshold: number;
}

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    address: null as `0x${string}` | null,
    connection: Connection.Guest as Connection,
    merchant: null as MerchantJSON | null,
  }),
  actions: {
    setAddress(newAddress: `0x${string}` | null) {
      this.address = newAddress;
    },
    setConnection(newConnection: Connection) {
      this.connection = newConnection;
    },
    setMerchant(newMerchant: MerchantJSON | null) {
      this.merchant = newMerchant;
    },
  },
});
