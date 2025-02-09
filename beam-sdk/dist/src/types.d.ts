import { Network, PaymentStatus } from "./enums";
export type HexString = `0x${string}`;
export interface Metadata {
    schemaVersion: number;
    value: string;
}
export interface CreateOneTimePayment {
    merchant: HexString;
    amount: bigint;
    token: HexString;
    description: string;
    metadata: Metadata;
    mintReceipt: boolean;
}
export interface CreateOneTimePaymentCallback {
    session: string;
    paymentId: HexString;
    payer: HexString;
    status: PaymentStatus;
    amount: bigint;
    token: HexString;
    timestamp: number;
    transactionHash: HexString;
    blockNumber: number;
}
export interface OneTimePaymentResult {
    paymentId: HexString;
    payer: HexString;
    status: PaymentStatus;
    amount: bigint;
    token: HexString;
    timestamp: number;
    transactionHash: HexString;
    blockNumber: number;
}
export interface CreateOneTimePayment {
    payers: HexString[];
    merchant: HexString;
    amounts: bigint[];
    token: HexString;
    description: string;
    metadata: Metadata;
    mintReceipt: boolean;
}
export interface FulfillOneTimePayment {
    paymentId: HexString;
    mintReceipt: boolean;
}
export interface OneTimePaymentResult {
    paymentId: HexString;
    payers: HexString[];
    amounts: bigint[];
    fulfillments: boolean[];
    status: PaymentStatus;
    token: HexString;
    timestamps: (number | null)[];
    transactionHashes: (HexString | null)[];
    blockNumbers: (number | null)[];
}
export interface CreateOneTimePaymentCallback extends OneTimePaymentResult {
    session: string;
}
export interface FulfillOneTimePaymentCallback extends OneTimePaymentResult {
    session: string;
}
export interface CreateRecurrentPayment {
    merchant: HexString;
    subscriptionId: HexString;
    description: string;
    metadata: Metadata;
    mintReceipt: boolean;
}
export interface FulfillRecurrentPayment {
    paymentId: HexString;
    subscriptionId: HexString;
    mintReceipt: boolean;
}
export interface CancelRecurrentPayment {
    paymentId: HexString;
    subscriptionId: HexString;
}
export interface RecurrentPaymentResult {
    paymentId: HexString;
    subscriptionId: HexString;
    payer: HexString;
    status: PaymentStatus;
    amount: bigint;
    dueDate: bigint;
    token: HexString;
    timestamp: number;
    transactionHash: HexString;
    blockNumber: number;
}
export interface CreateRecurrentPaymentCallback extends RecurrentPaymentResult {
    session: string;
}
export interface FulfillRecurrentPaymentCallback extends RecurrentPaymentResult {
    session: string;
}
export interface CancelRecurrentPaymentCallback extends RecurrentPaymentResult {
    session: string;
}
export interface SubscriptionResult {
    subscriptionId: HexString;
    merchant: HexString;
    amount: bigint;
    token: HexString;
    description: string;
    interval: bigint;
    gracePeriod: bigint;
    timestamp: number;
}
export interface GetSubscription {
    subscriptionId: HexString;
}
export interface GetSubscriptions {
    merchant: HexString;
    page: number;
    limit: number;
}
export interface GetPayment {
    paymentId: HexString;
}
export interface GetPayments {
    merchant: HexString;
    page: number;
    limit: number;
    payer?: HexString;
    amountMin?: number;
    amountMax?: number;
    timestampMin?: number;
    timestampMax?: number;
    status?: PaymentStatus;
}
export interface MerchantResult {
}
export interface GetMerchant {
    merchant: HexString;
}
export interface BeamSDKOptions {
    network: Network;
    timeout?: number;
    graphURL?: string;
    paymentURL?: string;
}
