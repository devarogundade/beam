import {
  CancelRecurrentPayment,
  CreateRecurrentPayment,
  CreateRecurrentPaymentCallback,
  FulfillRecurrentPayment,
  FulfillRecurrentPaymentCallback,
  RecurrentPaymentResult,
  CancelRecurrentPaymentCallback,
  GetPayments,
  GetPayment,
  SubscriptionResult,
  GetSubscription,
  GetSubscriptions,
} from "../types";

export interface IRecurrentPayment {
  create(
    params: CreateRecurrentPayment
  ): Promise<CreateRecurrentPaymentCallback>;

  fulfill(
    params: FulfillRecurrentPayment
  ): Promise<FulfillRecurrentPaymentCallback>;

  cancel(
    params: CancelRecurrentPayment
  ): Promise<CancelRecurrentPaymentCallback>;

  getSubscription(params: GetSubscription): Promise<SubscriptionResult | null>;

  getSubscriptions(params: GetSubscriptions): Promise<SubscriptionResult[]>;

  getPayment(params: GetPayment): Promise<RecurrentPaymentResult | null>;

  getPayments(params: GetPayments): Promise<RecurrentPaymentResult[]>;
}
