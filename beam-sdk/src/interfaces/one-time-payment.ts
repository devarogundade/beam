import {
  CreateOneTimePayment,
  CreateOneTimePaymentCallback,
  FulfillOneTimePayment,
  FulfillOneTimePaymentCallback,
  GetPayment,
  GetPayments,
  Payment,
} from "../types";

export interface IOneTimePayment {
  create(params: CreateOneTimePayment): Promise<CreateOneTimePaymentCallback>;

  fulfill(
    params: FulfillOneTimePayment
  ): Promise<FulfillOneTimePaymentCallback>;

  getPayment(params: GetPayment): Promise<Payment | null>;

  getPayments(params: GetPayments): Promise<Payment[]>;

  getOneTimePayments(params: GetPayments): Promise<Payment[]>;
}
