// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SimpleReceiptModule from "./SimpleReceipt";
import MerchantModule from "./Merchant";

const RecurrentPaymentModule = buildModule("RecurrentPaymentModule", (m) => {
  const { simpleReceipt } = m.useModule(SimpleReceiptModule);
  const { merchant } = m.useModule(MerchantModule);

  const hashLib = m.library("HashLib");

  const recurrentPayment = m.contract(
    "RecurrentPayment",
    [simpleReceipt, merchant],
    {
      libraries: {
        HashLib: hashLib,
      },
    }
  );

  return { recurrentPayment };
});

export default RecurrentPaymentModule;
