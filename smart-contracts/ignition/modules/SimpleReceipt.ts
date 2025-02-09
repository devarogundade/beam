// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BASE_URL = "https://beam.netlify.app/receipts";

const SimpleReceiptModule = buildModule("SimpleReceiptModule", (m) => {
  const baseURI = m.getParameter("baseURI_", BASE_URL);

  const simpleReceipt = m.contract("SimpleReceipt", [baseURI]);

  return { simpleReceipt };
});

export default SimpleReceiptModule;
