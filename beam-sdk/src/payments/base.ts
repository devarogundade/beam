import { BeamClient } from "../client";
import { GetPayment, GetPayments, Payment } from "../types";
import { Graph } from "../utils/graph";
import { v4 as uuidv4 } from "uuid";
import { Hex } from "viem";

export abstract class BasePayment {
  private currentTab: Window | null;
  protected readonly graph: Graph;
  protected readonly paymentURL: string;
  protected readonly basePath: string = "/";

  constructor(client: BeamClient) {
    this.currentTab = null;
    this.graph = new Graph(client);
    this.paymentURL = client.getPaymentURL();
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

    window.addEventListener("message", (event) => {
      this.messageHandler(event, callback);
    });

    // Check if the tab was closed without a result
    const interval = setInterval(() => {
      if (!this.currentTab) {
        throw new Error("Payment tab failed.");
      }
      if (this.currentTab.closed) {
        clearInterval(interval);
        window.removeEventListener("message", (event) => {
          this.messageHandler(event, callback);
        });
        throw new Error("The new tab was closed without returning data.");
      }
    }, 500);

    if (!this.currentTab) {
      throw new Error("Payment tab failed.");
    }

    this.currentTab.onload = () => {
      if (!this.currentTab) {
        throw new Error("Payment tab failed.");
      }

      console.log("Data posted");

      this.currentTab.postMessage(data, this.paymentURL);
    };
  }

  // Event listener for messages from the new tab
  private messageHandler(event: MessageEvent, callback: (data: any) => void) {
    if (!this.currentTab) {
      throw new Error("Payment tab failed.");
    }

    if (event.origin !== window.location.origin) {
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

  getPayment(params: GetPayment): Promise<Payment | null> {
    return this.graph.getPayment(params.paymentId);
  }

  getPayments(params: GetPayments): Promise<Payment[]> {
    return this.graph.getPayments(
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
