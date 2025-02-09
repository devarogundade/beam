import { BeamClient } from "../client";
import { IOneTimePayment } from "../interfaces/one-time-payment";
import { CreateOneTimePayment, CreateOneTimePaymentCallback, GetPayment, GetPayments, OneTimePaymentResult } from "../types";
import { BasePayment } from "./base";
export declare class OneTimePayment extends BasePayment implements IOneTimePayment {
    private readonly client;
    constructor(client: BeamClient);
    create(params: CreateOneTimePayment): Promise<CreateOneTimePaymentCallback>;
    getPayment(params: GetPayment): Promise<OneTimePaymentResult | null>;
    getPayments(params: GetPayments): Promise<OneTimePaymentResult[]>;
}
