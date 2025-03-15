import { BeamClient } from "./client";
import { OneTimeTransaction } from "./transactions/one-time-transaction";
import { RecurrentTransaction } from "./transactions/recurrent-transaction";
import { IMerchant } from "./interfaces/merchant";
import { Merchant } from "./merchant/index";
import { IRecurrentTransaction } from "./interfaces/recurrent-transaction";
import { IOneTimeTransaction } from "./interfaces/one-time-transaction";
import type { BeamSDKOptions } from "./types";
class BeamSDK {
  private readonly options: BeamSDKOptions;

  public merchant: IMerchant;
  public OneTimeTransaction: IOneTimeTransaction;
  public oneTimeTransaction: IOneTimeTransaction;
  public recurrentTransaction: IRecurrentTransaction;

  constructor(options: BeamSDKOptions) {
    this.options = options;

    const client = new BeamClient(this.options);

    this.merchant = new Merchant(client);
    this.OneTimeTransaction = new OneTimeTransaction(client);
    this.oneTimeTransaction = new OneTimeTransaction(client);
    this.recurrentTransaction = new RecurrentTransaction(client);
  }
}

export default BeamSDK;
