import { CreateOneTimePayment, CreateOneTimePaymentCallback, FulfillOneTimePayment, FulfillOneTimePaymentCallback, GetPayment, GetPayments, OneTimePaymentResult } from "../types";
export interface IOneTimePayment {
    create(params: CreateOneTimePayment): Promise<CreateOneTimePaymentCallback>;
    fulfill(params: FulfillOneTimePayment): Promise<FulfillOneTimePaymentCallback>;
    getPayment(params: GetPayment): Promise<OneTimePaymentResult | null>;
    getPayments(params: GetPayments): Promise<OneTimePaymentResult[]>;
}
