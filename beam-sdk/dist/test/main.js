"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const enums_1 = require("../src/enums");
const constants_1 = require("./../src/utils/constants");
document.getElementById("pay")?.addEventListener("click", pay);
const sdk = new index_1.BeamSDK({ network: enums_1.Network.Testnet });
function pay() {
    console.log("pay");
    sdk.oneTimePayment
        .create({
        amount: BigInt(100000000000000),
        description: "Test pay",
        merchant: "0xmerchant",
        metadata: {
            schemaVersion: constants_1.SCHEMA_JSON,
            value: JSON.stringify({ name: "Test" }),
        },
        mintReceipt: true,
        token: "0xtoken",
    })
        .then((data) => {
        console.log(data);
    })
        .catch((error) => {
        console.error(error);
    });
}
//# sourceMappingURL=main.js.map