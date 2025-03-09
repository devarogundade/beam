import { BaseMerchant } from "./base";
import { BeamClient } from "../client";
import { IMerchant } from "../interfaces/merchant";

export class Merchant extends BaseMerchant implements IMerchant {
  constructor(client: BeamClient) {
    super(client);
  }
}
