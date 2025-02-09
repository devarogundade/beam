import { BeamClient } from "../client";
import { IMerchant } from "../interfaces/merchant";
import { GetMerchant, MerchantResult } from "../types";
import { merchantQuery } from "../utils/queries";
import { BaseMerchant } from "./base";

export class Merchant extends BaseMerchant implements IMerchant {
  private readonly client: BeamClient;

  constructor(client: BeamClient) {
    super();
    this.client = client;
  }

  getMerchant(params: GetMerchant): Promise<MerchantResult> {
    return this.client.request("POST", this.basePath, merchantQuery(params));
  }
}
