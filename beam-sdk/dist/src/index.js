"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeamSDK = void 0;
const client_1 = require("./client");
const split_payment_1 = require("./payments/split-payment");
const one_time_payment_1 = require("./payments/one-time-payment");
const recurrent_payment_1 = require("./payments/recurrent-payment");
const index_1 = require("./merchant/index");
class BeamSDK {
    constructor(options) {
        this.options = options;
        const client = new client_1.BeamClient(this.options);
        this.merchant = new index_1.Merchant(client);
        this.splitPayment = new split_payment_1.OneTimePayment(client);
        this.oneTimePayment = new one_time_payment_1.OneTimePayment(client);
        this.recurrentPayment = new recurrent_payment_1.RecurrentPayment(client);
    }
}
exports.BeamSDK = BeamSDK;
//# sourceMappingURL=index.js.map