// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SimpleReceiptModule from "./SimpleReceipt";
import MerchantModule from "./Merchant";

const RecurrentTransactionModule = buildModule(
  "RecurrentTransactionModule",
  (m) => {
    const { simpleReceipt } = m.useModule(SimpleReceiptModule);
    const { merchant } = m.useModule(MerchantModule);

    const hashLib = m.library("HashLib");

    const recurrentTransaction = m.contract(
      "RecurrentTransaction",
      [simpleReceipt, merchant],
      {
        libraries: {
          HashLib: hashLib,
        },
      }
    );

    return { recurrentTransaction };
  }
);

export default RecurrentTransactionModule;
