import { Endpoints } from "../utils/endpoints";
import { BeamClient } from "../client";
import { IOneTimePayment } from "../interfaces/one-time-payment";
import {
  CreateOneTimePayment,
  CreateOneTimePaymentCallback,
  FulfillOneTimePayment,
  FulfillOneTimePaymentCallback,
  GetPayment,
  GetPayments,
  OneTimePaymentResult,
} from "../types";
import { BasePayment } from "./base";
import { oneTimePaymentQuery, oneTimePaymentsQuery } from "../utils/queries";

export class OneTimePayment extends BasePayment implements IOneTimePayment {
  private readonly client: BeamClient;

  constructor(client: BeamClient) {
    super();
    this.client = client;
  }

  async create(
    params: CreateOneTimePayment
  ): Promise<CreateOneTimePaymentCallback> {
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
          (data: CreateOneTimePaymentCallback) => {
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
    params: FulfillOneTimePayment
  ): Promise<FulfillOneTimePaymentCallback> {
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
          (data: FulfillOneTimePaymentCallback) => {
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

  getPayment(params: GetPayment): Promise<OneTimePaymentResult | null> {
    return this.client.request(
      "POST",
      this.basePath,
      oneTimePaymentQuery(params)
    );
  }

  getPayments(params: GetPayments): Promise<OneTimePaymentResult[]> {
    return this.client.request(
      "POST",
      this.basePath,
      oneTimePaymentsQuery(params)
    );
  }
}
