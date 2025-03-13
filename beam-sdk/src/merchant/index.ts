import { BaseMerchant } from "./base";
import { BeamClient } from "../client";
import { IMerchant } from "../interfaces/merchant";
import { GetMerchant, Merchant as MerchantType } from "src/types";

export class Merchant extends BaseMerchant implements IMerchant {
  constructor(client: BeamClient) {
    super(client);
  }

  getMerchant(params: GetMerchant): Promise<MerchantType | null> {
    return this.graph.getMerchant(params.merchant);
  }
}
