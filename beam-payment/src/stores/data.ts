import { type Hex } from "viem";
import { defineStore } from "pinia";
import type { Metadata } from "@/scripts/types";

interface PayData {
  merchant: Hex;
  payers: Hex[];
  amounts: bigint[];
  token?: Hex;
  description?: string;
  metadata?: Metadata;
  mintReceipt?: false;
}

interface Initiator {
  url: string;
  title: string | null;
  favicon: string | null;
}

export const useDataStore = defineStore("data", {
  state: () => ({
    data: null as PayData | null,
    initiator: null as Initiator | null,
  }),
  actions: {
    setData(newData: PayData | null) {
      this.data = newData;
    },
    setInitiator(newInitiator: Initiator | null) {
      this.initiator = newInitiator;
    },
  },
});
