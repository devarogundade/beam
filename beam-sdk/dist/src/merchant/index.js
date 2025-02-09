"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merchant = void 0;
const queries_1 = require("../utils/queries");
const base_1 = require("./base");
class Merchant extends base_1.BaseMerchant {
    constructor(client) {
        super();
        this.client = client;
    }
    getMerchant(params) {
        return this.client.request("POST", this.basePath, (0, queries_1.merchantQuery)(params));
    }
}
exports.Merchant = Merchant;
//# sourceMappingURL=index.js.map