// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SimpleReceiptModule from "./SimpleReceipt";

const OneTimeTransactionModule = buildModule(
  "OneTimeTransactionModule",
  (m) => {
    const { simpleReceipt } = m.useModule(SimpleReceiptModule);

    const hashLib = m.library("HashLib");

    const oneTimeTransaction = m.contract(
      "OneTimeTransaction",
      [simpleReceipt],
      {
        libraries: {
          HashLib: hashLib,
        },
      }
    );

    return { oneTimeTransaction };
  }
);

export default OneTimeTransactionModule;
