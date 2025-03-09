import { Endpoints } from "../utils/endpoints";
import { IOneTimePayment } from "../interfaces/one-time-payment";
import {
  CreateOneTimePayment,
  CreateOneTimePaymentCallback,
  FulfillOneTimePayment,
  FulfillOneTimePaymentCallback,
  GetPayments,
  Payment,
} from "../types";
import { BasePayment } from "./base";
import { PaymentType } from "../enums";

export class OneTimePayment extends BasePayment implements IOneTimePayment {
  async create(
    params: CreateOneTimePayment
  ): Promise<CreateOneTimePaymentCallback> {
    return new Promise((resolve, reject) => {
      const session = this.createSession();
      const sessionedPaymentURL = this.buildUrl({ session });

      try {
        this.launchTabAndAwaitResult(
          sessionedPaymentURL,
          params,
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
      const sessionedPaymentURL = this.buildUrl({ session });

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

  getOneTimePayments(params: GetPayments): Promise<Payment[]> {
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
      PaymentType.OneTime
    );
  }
}
