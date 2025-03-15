import { BeamClient } from "../client";
import {
  GetPayment,
  GetPaymentHash,
  GetTransactions,
  Transaction,
} from "../types";
import { Graph } from "../utils/graph";
import { v4 as uuidv4 } from "uuid";
import { Hex } from "viem";

export abstract class BaseTransaction {
  private currentTab: Window | null;
  protected readonly graph: Graph;
  protected readonly paymentURL: string;
  protected readonly basePath: string = "/";

  constructor(client: BeamClient) {
    this.currentTab = null;
    this.graph = new Graph(client);
    this.paymentURL = client.getTransactionURL();
  }

  protected createSession(): string {
    return uuidv4();
  }

  protected buildUrl(
    params: Record<string, Hex | string | number | boolean | undefined>
  ): string {
    const url = new URL(this.paymentURL);

    // Add search parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    url.searchParams.append("initiator", window.location.origin);

    return url.toString();
  }

  protected async launchTabAndAwaitResult(
    url: string,
    data: any,
    callback: (data: any) => void
  ) {
    if (this.currentTab) {
      throw new Error("Error: an active payment tab detected.");
    }

    this.currentTab = window.open(url, "_blank");

    setTimeout(() => {
      if (!this.currentTab) {
        throw new Error("Payment tab failed.");
      }

      if (!this.currentTab) {
        throw new Error("Payment tab failed.");
      }

      this.currentTab.postMessage(JSON.stringify(data), this.paymentURL);
    }, 3000);

    // Check if the tab was closed without a result
    const interval = setInterval(() => {
      if (!this.currentTab) {
        return clearInterval(interval);
      }

      if (this.currentTab.closed) {
        clearInterval(interval);
        window.removeEventListener("message", (event) => {
          this.messageHandler(event, callback);
        });
        this.currentTab = null;
        throw new Error("The new tab was closed without returning data.");
      }
    }, 500);

    window.addEventListener("message", (event) => {
      if (!this.currentTab) {
        clearInterval(interval);
        throw new Error("Payment tab failed.");
      }

      this.messageHandler(event, callback);
    });
  }

  // Event listener for messages from the new tab
  private messageHandler(event: MessageEvent, callback: (data: any) => void) {
    if (!this.currentTab) {
      throw new Error("Payment tab failed.");
    }

    if (event.origin !== this.paymentURL) {
      console.warn("Received message from untrusted origin:", event.origin);
      return;
    }

    // Ensure the message came from the new tab
    if (event.source === this.currentTab) {
      // Resolve the promise with the message data
      callback(event.data);

      // Clean up
      window.removeEventListener("message", (event) => {
        this.messageHandler(event, callback);
      });

      this.currentTab.close();
      this.currentTab = null;
    }
  }

  getTransaction(params: GetPayment): Promise<Transaction | null> {
    return this.graph.getTransaction(params.transactionId);
  }

  getTransactionsFromHash(params: GetPaymentHash): Promise<Transaction[]> {
    return this.graph.getTransactionsFromHash(params.transactionHash);
  }

  getTransactions(params: GetTransactions): Promise<Transaction[]> {
    return this.graph.getTransactions(
      params.merchant,
      params.page,
      params.limit,
      params.payer,
      params.amountMin,
      params.amountMax,
      params.timestampMin,
      params.timestampMax,
      params.status
    );
  }
}
