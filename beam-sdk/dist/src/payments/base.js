"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePayment = void 0;
const uuid_1 = require("uuid");
class BasePayment {
    constructor() {
        this.basePath = "/";
        this.currentTab = null;
    }
    createSession() {
        return (0, uuid_1.v4)();
    }
    buildUrl(baseUrl, params) {
        const url = new URL(baseUrl);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, value.toString());
            }
        });
        return url.toString();
    }
    async launchTabAndAwaitResult(url, { data, target }, callback) {
        if (this.currentTab) {
            throw new Error("Error: an active payment tab detected.");
        }
        this.currentTab = window.open(url, "_blank");
        window.addEventListener("message", (event) => {
            this.messageHandler(event, callback);
        });
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
            this.currentTab.postMessage(data, target);
        };
    }
    messageHandler(event, callback) {
        if (!this.currentTab) {
            throw new Error("Payment tab failed.");
        }
        if (event.origin !== window.location.origin) {
            console.warn("Received message from untrusted origin:", event.origin);
            return;
        }
        if (event.source === this.currentTab) {
            callback(event.data);
            window.removeEventListener("message", (event) => {
                this.messageHandler(event, callback);
            });
            this.currentTab.close();
            this.currentTab = null;
        }
    }
}
exports.BasePayment = BasePayment;
//# sourceMappingURL=base.js.map