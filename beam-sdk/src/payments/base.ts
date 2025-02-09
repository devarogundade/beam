import { HexString } from "../types";
import { v4 as uuidv4 } from "uuid";

export abstract class BasePayment {
  private currentTab: Window | null;
  protected readonly basePath: string = "/";

  constructor() {
    this.currentTab = null;
  }

  protected createSession(): string {
    return uuidv4();
  }

  protected buildUrl(
    baseUrl: string,
    params: Record<string, HexString | string | number | boolean | undefined>
  ): string {
    const url = new URL(baseUrl);

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
    { data, target }: { data: any; target: string; },
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

      console.log('Data posted');

      this.currentTab.postMessage(data, target);
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
}
