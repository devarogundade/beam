import { CreateOneTimePayment, CreateOneTimePaymentCallback, GetPayment, GetPayments, OneTimePaymentResult } from "./../types";
export interface IOneTimePayment {
    create(params: CreateOneTimePayment): Promise<CreateOneTimePaymentCallback>;
    getPayment(params: GetPayment): Promise<OneTimePaymentResult | null>;
    getPayments(params: GetPayments): Promise<OneTimePaymentResult[]>;
}
