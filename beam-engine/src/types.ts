/* eslint-disable prettier/prettier */

export type HexString = `0x${string}`;

export type WebhookOptions = {
    merchant: HexString;
    event: any;
};

export type ReceiptOptions = {
    payer: HexString;
    token: HexString;
    amount: bigint;
    tokenId: number,
    timestamp: number;
    paymentId: HexString;
    transactionHash: HexString;
};

export type UpdaeWebhooks = {
    merchant: HexString;
    webhooks: string[];
};