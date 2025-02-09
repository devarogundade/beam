import { GetMerchant, MerchantResult } from "../types";
export interface IMerchant {
    getMerchant(params: GetMerchant): Promise<MerchantResult>;
}
