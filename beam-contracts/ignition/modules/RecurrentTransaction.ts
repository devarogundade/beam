// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import ReceiptModule from "./Receipt";
import MerchantModule from "./Merchant";

const RecurrentTransactionModule = buildModule(
  "RecurrentTransactionModule",
  (m) => {
    const { receipt } = m.useModule(ReceiptModule);
    const { merchant } = m.useModule(MerchantModule);

    const hashLib = m.library("HashLib");

    const recurrentTransaction = m.contract(
      "RecurrentTransaction",
      [receipt, merchant],
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
