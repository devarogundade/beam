import { BaseMerchant } from "./base";
import { BeamClient } from "../client";
import { IMerchant } from "../interfaces/merchant";
import type { GetMerchant, Merchant as MerchantType } from "../types";

export class Merchant extends BaseMerchant implements IMerchant {
  constructor(client: BeamClient) {
    super(client);
  }

  getMerchant(params: GetMerchant): Promise<MerchantType | null> {
    return this.graph.getMerchant(params.merchant);
  }
}
