import { IMerchant } from "./interfaces/merchant";
import { IRecurrentPayment } from "./interfaces/recurrent-payment";
import { IOneTimePayment } from "./interfaces/one-time-payment";
import { IOneTimePayment } from "./interfaces/split-payment";
import { BeamSDKOptions } from "./types";
export declare class BeamSDK {
    private readonly options;
    merchant: IMerchant;
    splitPayment: IOneTimePayment;
    oneTimePayment: IOneTimePayment;
    recurrentPayment: IRecurrentPayment;
    constructor(options: BeamSDKOptions);
}
