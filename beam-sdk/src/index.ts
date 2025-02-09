import { BeamClient } from "./client";
import { OneTimePayment } from "./payments/OneTime-payment";
import { OneTimePayment } from "./payments/one-time-payment";
import { RecurrentPayment } from "./payments/recurrent-payment";
import { IMerchant } from "./interfaces/merchant";
import { Merchant } from "./merchant/index";
import { IRecurrentPayment } from "./interfaces/recurrent-payment";
import { IOneTimePayment } from "./interfaces/one-time-payment";
import { IOneTimePayment } from "./interfaces/OneTime-payment";
import { BeamSDKOptions } from "./types";

export class BeamSDK {
  private readonly options: BeamSDKOptions;

  public merchant: IMerchant;
  public OneTimePayment: IOneTimePayment;
  public oneTimePayment: IOneTimePayment;
  public recurrentPayment: IRecurrentPayment;

  constructor(options: BeamSDKOptions) {
    this.options = options;

    const client = new BeamClient(this.options);

    this.merchant = new Merchant(client);
    this.OneTimePayment = new OneTimePayment(client);
    this.oneTimePayment = new OneTimePayment(client);
    this.recurrentPayment = new RecurrentPayment(client);
  }
}
