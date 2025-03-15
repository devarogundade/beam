import type {
  Merchant,
  Transaction,
  Confirmation,
  Subscription,
  WithdrawRequest,
} from "../types";
import type { Hex } from "viem";
import { TransactionStatus, TransactionType } from "../enums";
import { BeamClient } from "../client";

export class Graph {
  private client: BeamClient;

  constructor(client: BeamClient) {
    this.client = client;
  }

  async getMerchant(merchant: Hex): Promise<Merchant | null> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            merchant(id: "${merchant.toLowerCase()}") {
                id
                merchant
                metadata_schemaVersion
                metadata_value
                wallet
                tokens
                hook
                signers
                minSigners
                blockNumber
                blockTimestamp
                transactionHash
            }
        }`,
      });

      return data.data.merchant;
    } catch (error) {
      return null;
    }
  }

  async getTransaction(transactionId: Hex): Promise<Transaction | null> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            transaction(id: "${transactionId.toLowerCase()}") {
                id
                transactionId
                payer
                payers
                fulfilleds
                merchant
                token
                amounts
                adjustedToken
                adjustedAmount
                dueDate
                amount
                timestamp
                description
                metadata_schemaVersion
                metadata_value
                status
                type
                blockNumber
                blockTimestamp
                transactionHash
                confirmations {
                  id
                  transactionId
                  from
                  recipient
                  token
                  amount
                  adjustedToken
                  adjustedAmount
                  description
                  type      
                  blockNumber
                  blockTimestamp
                  transactionHash
                }
            }
        }`,
      });

      return data.data.transaction;
    } catch (error) {
      return null;
    }
  }

  async getTransactionsFromHash(transactionHash: Hex): Promise<Transaction[]> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            transactions(where: {transactionHash: "${transactionHash.toLowerCase()}"}) {
                id
                transactionId
                payer
                payers
                fulfilleds
                merchant
                token
                amounts
                adjustedToken
                adjustedAmount
                dueDate
                amount
                timestamp
                description
                metadata_schemaVersion
                metadata_value
                status
                type
                blockNumber
                blockTimestamp
                transactionHash
                confirmations {
                  id
                  transactionId
                  from
                  recipient
                  token
                  amount
                  adjustedToken
                  adjustedAmount
                  description
                  type      
                  blockNumber
                  blockTimestamp
                  transactionHash
                }
            }
        }`,
      });

      return data.data.transactions;
    } catch (error) {
      return [];
    }
  }

  async getTransactions(
    merchant: Hex,
    page: number,
    limit: number,
    payer?: Hex,
    amountMin?: number,
    amountMax?: number,
    timestampMin?: number,
    timestampMax?: number,
    status?: TransactionStatus,
    type?: TransactionType
  ): Promise<Transaction[]> {
    try {
      let filters = `merchant: "${merchant}"`;

      if (payer) filters += `, payer: "${payer}"`;
      if (amountMin) filters += `, amount_gte: ${amountMin}`;
      if (amountMax) filters += `, amount_lte: ${amountMax}`;
      if (timestampMin) filters += `, timestamp_gte: ${timestampMin}`;
      if (timestampMax) filters += `, timestamp_lte: ${timestampMax}`;
      if (status) filters += `, status: "${status}"`;
      if (status) filters += `, type: "${type}"`;

      const data = await this.client.graphCall<any>({
        query: `{
        transactions(
          where: { ${filters} }
          first: ${limit}
          skip: ${(page - 1) * limit}
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          transactionId
          payer
          payers
          fulfilleds
          merchant
          token
          amounts
          adjustedToken
          adjustedAmount
          dueDate
          amount
          timestamp
          description
          metadata_schemaVersion
          metadata_value
          status
          type
          blockNumber
          blockTimestamp
          transactionHash
          confirmations {
            id
            transactionId
            from
            recipient
            token
            amount
            adjustedToken
            adjustedAmount
            description
            type      
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      }`,
      });

      return data?.data?.transactions ?? [];
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  }

  async getConfirmation(id: Hex): Promise<Confirmation | null> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            confirmation(id: "${id.toLowerCase()}") {
                id
                transactionId
                from
                recipient
                token
                amount
                adjustedToken
                adjustedAmount
                description
                type
                blockNumber
                blockTimestamp
                transactionHash
            }
        }`,
      });

      return data.data.confirmation;
    } catch (error) {
      return null;
    }
  }

  async getTransactionConfirmations(
    transactionId: Hex
  ): Promise<Confirmation[]> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            confirmations(where: {transactionId: "${transactionId.toLowerCase()}"}) {
                id
                transactionId
                from
                recipient
                token
                amount
                adjustedToken
                adjustedAmount
                description
                type
                blockNumber
                blockTimestamp
                transactionHash
            }
        }`,
      });

      return data.data.confirmations;
    } catch (error) {
      return [];
    }
  }

  async getConfirmations(account: Hex): Promise<Confirmation[]> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            confirmations(where: {recipient: "${account.toLowerCase()}"}) {
                id
                transactionId
                from
                recipient
                token
                amount
                adjustedToken
                adjustedAmount
                description
                type
                blockNumber
                blockTimestamp
                transactionHash
            }
        }`,
      });

      return data.data.confirmations;
    } catch (error) {
      return [];
    }
  }

  async getSubscription(subsciptionId: Hex): Promise<Subscription | null> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            subscriptionPlan(id: "${subsciptionId.toLowerCase()}") {
                id
                subsciptionId
                merchant
                interval
                amount
                gracePeriod
                description
                trashed
                blockNumber
                blockTimestamp
                transactionHash
            }
        }`,
      });

      return data.data.subscription;
    } catch (error) {
      return null;
    }
  }

  async getSubscriptions(
    merchant: Hex,
    page: number,
    limit: number
  ): Promise<Subscription[]> {
    try {
      const skip = (page - 1) * limit;

      const data = await this.client.graphCall<any>({
        query: `{
        subscriptionPlans(
          where: {merchant: "${merchant}"},
          first: ${limit},
          skip: ${skip},
          orderBy: blockTimestamp,
          orderDirection: desc
        ) {
          id
          subscriptionId
          merchant
          interval
          amount
          gracePeriod
          description
          trashed
          blockNumber
          blockTimestamp
          transactionHash
        }
      }`,
      });

      return data?.data?.subscriptions ?? [];
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return [];
    }
  }

  async getWithdrawRequest(
    merchant: Hex,
    requestId: number
  ): Promise<WithdrawRequest | null> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            withdrawRequest(id: "${merchant.toLowerCase()}${requestId}") {
                id
                subsciptionId
                merchant
                interval
                amount
                gracePeriod
                description
                trashed
                blockNumber
                blockTimestamp
                transactionHash
                confirmations
            }
        }`,
      });

      return data.data.withdrawRequest;
    } catch (error) {
      return null;
    }
  }

  async getWithdrawRequests(merchant: Hex): Promise<WithdrawRequest[]> {
    try {
      const data = await this.client.graphCall<any>({
        query: `{
            withdrawRequests(where: {merchant: "${merchant.toLowerCase()}"}) {
                id
                subsciptionId
                merchant
                interval
                amount
                gracePeriod
                description
                trashed
                blockNumber
                blockTimestamp
                transactionHash
                confirmations
            }
        }`,
      });

      return data.data.withdrawRequests;
    } catch (error) {
      return [];
    }
  }
}
