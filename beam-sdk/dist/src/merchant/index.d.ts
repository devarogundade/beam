import { BeamClient } from "../client";
import { IMerchant } from "../interfaces/merchant";
import { GetMerchant, MerchantResult } from "../types";
import { BaseMerchant } from "./base";
export declare class Merchant extends BaseMerchant implements IMerchant {
    private readonly client;
    constructor(client: BeamClient);
    getMerchant(params: GetMerchant): Promise<MerchantResult>;
}
