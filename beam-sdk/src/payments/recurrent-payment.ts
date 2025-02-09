import { Endpoints } from "./../utils/endpoints";
import { BeamClient } from "../client";
import {
  CancelRecurrentPayment,
  CancelRecurrentPaymentCallback,
  CreateRecurrentPayment,
  CreateRecurrentPaymentCallback,
  FulfillRecurrentPayment,
  FulfillRecurrentPaymentCallback,
  GetPayment,
  GetPayments,
  GetSubscription,
  GetSubscriptions,
  RecurrentPaymentResult,
  SubscriptionResult,
} from "../types";
import { BasePayment } from "./base";
import {
  recurrentPaymentQuery,
  recurrentPaymentsQuery,
  subscriptionQuery,
  subscriptionsQuery,
} from "../utils/queries";
import { IRecurrentPayment } from "../interfaces/recurrent-payment";

export class RecurrentPayment extends BasePayment implements IRecurrentPayment {
  private readonly client: BeamClient;

  constructor(client: BeamClient) {
    super();
    this.client = client;
  }

  async create(
    params: CreateRecurrentPayment
  ): Promise<CreateRecurrentPaymentCallback> {
    return new Promise((resolve, reject) => {
      const paymentURL = Endpoints.BASE_PAYMENT_URL;

      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl(paymentURL, { session });

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
      const sessionedPaymentURL = this.buildUrl(paymentURL, { session });

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
      const sessionedPaymentURL = this.buildUrl(paymentURL, { session });

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

  getSubscription(params: GetSubscription): Promise<SubscriptionResult | null> {
    return this.client.request(
      "POST",
      this.basePath,
      subscriptionQuery(params)
    );
  }

  getSubscriptions(params: GetSubscriptions): Promise<SubscriptionResult[]> {
    return this.client.request(
      "POST",
      this.basePath,
      subscriptionsQuery(params)
    );
  }

  getPayment(params: GetPayment): Promise<RecurrentPaymentResult | null> {
    return this.client.request(
      "POST",
      this.basePath,
      recurrentPaymentQuery(params)
    );
  }

  getPayments(params: GetPayments): Promise<RecurrentPaymentResult[]> {
    return this.client.request(
      "POST",
      this.basePath,
      recurrentPaymentsQuery(params)
    );
  }
}
