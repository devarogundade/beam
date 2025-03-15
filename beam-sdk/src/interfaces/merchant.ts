import type { GetMerchant, Merchant } from "../types";

export interface IMerchant {
  getMerchant(params: GetMerchant): Promise<Merchant | null>;
}
