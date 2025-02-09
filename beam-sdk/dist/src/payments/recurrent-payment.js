"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurrentPayment = void 0;
const endpoints_1 = require("./../utils/endpoints");
const base_1 = require("./base");
const queries_1 = require("../utils/queries");
class RecurrentPayment extends base_1.BasePayment {
    constructor(client) {
        super();
        this.client = client;
    }
    async create(params) {
        return new Promise((resolve, reject) => {
            const paymentURL = endpoints_1.Endpoints.BASE_PAYMENT_URL;
            const session = this.createSession();
            const sessionedPaymentURL = this.buildUrl(paymentURL, { session });
            try {
                this.launchTabAndAwaitResult(sessionedPaymentURL, {
                    data: params,
                    target: paymentURL,
                }, (data) => {
                    if (data.session == session) {
                        resolve(data);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async fulfill(params) {
        return new Promise((resolve, reject) => {
            const paymentURL = endpoints_1.Endpoints.BASE_PAYMENT_URL;
            const session = this.createSession();
            const sessionedPaymentURL = this.buildUrl(paymentURL, { session });
            try {
                this.launchTabAndAwaitResult(sessionedPaymentURL, {
                    data: params,
                    target: paymentURL,
                }, (data) => {
                    if (data.session == session) {
                        resolve(data);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    cancel(params) {
        return new Promise((resolve, reject) => {
            const paymentURL = endpoints_1.Endpoints.BASE_PAYMENT_URL;
            const session = this.createSession();
            const sessionedPaymentURL = this.buildUrl(paymentURL, { session });
            try {
                this.launchTabAndAwaitResult(sessionedPaymentURL, {
                    data: params,
                    target: paymentURL,
                }, (data) => {
                    if (data.session == session) {
                        resolve(data);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getSubscription(params) {
        return this.client.request("POST", this.basePath, (0, queries_1.subscriptionQuery)(params));
    }
    getSubscriptions(params) {
        return this.client.request("POST", this.basePath, (0, queries_1.subscriptionsQuery)(params));
    }
    getPayment(params) {
        return this.client.request("POST", this.basePath, (0, queries_1.recurrentPaymentQuery)(params));
    }
    getPayments(params) {
        return this.client.request("POST", this.basePath, (0, queries_1.recurrentPaymentsQuery)(params));
    }
}
exports.RecurrentPayment = RecurrentPayment;
//# sourceMappingURL=recurrent-payment.js.map