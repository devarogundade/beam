// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import ReceiptModule from "./Receipt";

const OneTimeTransactionModule = buildModule(
  "OneTimeTransactionModule",
  (m) => {
    const { receipt } = m.useModule(ReceiptModule);

    const hashLib = m.library("HashLib");
    const boolLib = m.library("BoolLib");

    const oneTimeTransaction = m.contract("OneTimeTransaction", [receipt], {
      libraries: {
        HashLib: hashLib,
        BoolLib: boolLib,
      },
    });

    return { oneTimeTransaction };
  }
);

export default OneTimeTransactionModule;
