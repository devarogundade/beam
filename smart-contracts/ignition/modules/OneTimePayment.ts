// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SimpleReceiptModule from "./SimpleReceipt";

const OneTimePaymentModule = buildModule("OneTimePaymentModule", (m) => {
  const { simpleReceipt } = m.useModule(SimpleReceiptModule);

  const hashLib = m.library("HashLib");

  const oneTimePayment = m.contract("OneTimePayment", [simpleReceipt], {
    libraries: {
      HashLib: hashLib,
    },
  });

  return { oneTimePayment };
});

export default OneTimePaymentModule;
