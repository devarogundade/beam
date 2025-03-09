import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    address: null as `0x${string}` | null,
  }),
  actions: {
    setAddress(newAddress: `0x${string}` | null) {
      this.address = newAddress;
    },
  },
});
