import { BeamClient } from "../client";
import { CancelRecurrentPayment, CancelRecurrentPaymentCallback, CreateRecurrentPayment, CreateRecurrentPaymentCallback, FulfillRecurrentPayment, FulfillRecurrentPaymentCallback, GetPayment, GetPayments, GetSubscription, GetSubscriptions, RecurrentPaymentResult, SubscriptionResult } from "../types";
import { BasePayment } from "./base";
import { IRecurrentPayment } from "../interfaces/recurrent-payment";
export declare class RecurrentPayment extends BasePayment implements IRecurrentPayment {
    private readonly client;
    constructor(client: BeamClient);
    create(params: CreateRecurrentPayment): Promise<CreateRecurrentPaymentCallback>;
    fulfill(params: FulfillRecurrentPayment): Promise<FulfillRecurrentPaymentCallback>;
    cancel(params: CancelRecurrentPayment): Promise<CancelRecurrentPaymentCallback>;
    getSubscription(params: GetSubscription): Promise<SubscriptionResult | null>;
    getSubscriptions(params: GetSubscriptions): Promise<SubscriptionResult[]>;
    getPayment(params: GetPayment): Promise<RecurrentPaymentResult | null>;
    getPayments(params: GetPayments): Promise<RecurrentPaymentResult[]>;
}
