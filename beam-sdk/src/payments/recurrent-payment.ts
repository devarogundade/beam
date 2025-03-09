import { Endpoints } from "./../utils/endpoints";
import {
  CancelRecurrentPayment,
  CancelRecurrentPaymentCallback,
  CreateRecurrentPayment,
  CreateRecurrentPaymentCallback,
  FulfillRecurrentPayment,
  FulfillRecurrentPaymentCallback,
  GetPayments,
  GetSubscription,
  GetSubscriptions,
  Payment,
  Subscription,
} from "../types";
import { BasePayment } from "./base";
import { IRecurrentPayment } from "../interfaces/recurrent-payment";
import { PaymentType } from "../enums";

export class RecurrentPayment extends BasePayment implements IRecurrentPayment {
  async create(
    params: CreateRecurrentPayment
  ): Promise<CreateRecurrentPaymentCallback> {
    return new Promise((resolve, reject) => {
      const paymentURL = Endpoints.BASE_PAYMENT_URL;

      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          {
            data: params,
            target: paymentURL,
          },
          (data: CreateRecurrentPaymentCallback) => {
            if (data.session == session) {
              resolve(data);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async fulfill(
    params: FulfillRecurrentPayment
  ): Promise<FulfillRecurrentPaymentCallback> {
    return new Promise((resolve, reject) => {
      const paymentURL = Endpoints.BASE_PAYMENT_URL;

      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          {
            data: params,
            target: paymentURL,
          },
          (data: FulfillRecurrentPaymentCallback) => {
            if (data.session == session) {
              resolve(data);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  cancel(
    params: CancelRecurrentPayment
  ): Promise<CancelRecurrentPaymentCallback> {
    return new Promise((resolve, reject) => {
      const paymentURL = Endpoints.BASE_PAYMENT_URL;

      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          {
            data: params,
            target: paymentURL,
          },
          (data: FulfillRecurrentPaymentCallback) => {
            if (data.session == session) {
              resolve(data);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  getSubscription(params: GetSubscription): Promise<Subscription | null> {
    return this.graph.getSubscription(params.subscriptionId);
  }

  getSubscriptions(params: GetSubscriptions): Promise<Subscription[]> {
    return this.graph.getSubscriptions(
      params.merchant,
      params.page,
      params.limit
    );
  }

  getRecurrentPayments(params: GetPayments): Promise<Payment[]> {
    return this.graph.getPayments(
      params.merchant,
      params.page,
      params.limit,
      params.payer,
      params.amountMin,
      params.amountMax,
      params.timestampMin,
      params.timestampMax,
      params.status,
      PaymentType.Recurrent
    );
  }
}
