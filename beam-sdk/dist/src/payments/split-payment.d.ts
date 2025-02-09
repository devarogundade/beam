import { BeamClient } from "../client";
import { IOneTimePayment } from "../interfaces/split-payment";
import { CreateOneTimePayment, CreateOneTimePaymentCallback, FulfillOneTimePayment, FulfillOneTimePaymentCallback, GetPayment, GetPayments, OneTimePaymentResult } from "../types";
import { BasePayment } from "./base";
export declare class OneTimePayment extends BasePayment implements IOneTimePayment {
    private readonly client;
    constructor(client: BeamClient);
    create(params: CreateOneTimePayment): Promise<CreateOneTimePaymentCallback>;
    fulfill(params: FulfillOneTimePayment): Promise<FulfillOneTimePaymentCallback>;
    getPayment(params: GetPayment): Promise<OneTimePaymentResult | null>;
    getPayments(params: GetPayments): Promise<OneTimePaymentResult[]>;
}
