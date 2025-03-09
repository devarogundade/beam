import {
  CancelRecurrentPayment,
  CreateRecurrentPayment,
  CreateRecurrentPaymentCallback,
  FulfillRecurrentPayment,
  FulfillRecurrentPaymentCallback,
  Payment,
  CancelRecurrentPaymentCallback,
  GetPayments,
  GetPayment,
  Subscription,
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

  getSubscription(params: GetSubscription): Promise<Subscription | null>;

  getSubscriptions(params: GetSubscriptions): Promise<Subscription[]>;

  getPayment(params: GetPayment): Promise<Payment | null>;

  getPayments(params: GetPayments): Promise<Payment[]>;

  getRecurrentPayments(params: GetPayments): Promise<Payment[]>;
}
