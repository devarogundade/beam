"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = exports.PaymentType = exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["Pending"] = 0] = "Pending";
    PaymentStatus[PaymentStatus["Active"] = 1] = "Active";
    PaymentStatus[PaymentStatus["Completed"] = 2] = "Completed";
    PaymentStatus[PaymentStatus["Cancelled"] = 3] = "Cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType[PaymentType["OneTime"] = 0] = "OneTime";
    PaymentType[PaymentType["OneTime"] = 1] = "OneTime";
    PaymentType[PaymentType["Recurrent"] = 2] = "Recurrent";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var Network;
(function (Network) {
    Network["Testnet"] = "Testnet";
})(Network || (exports.Network = Network = {}));
//# sourceMappingURL=enums.js.map