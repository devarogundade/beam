// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ReceiptModule = buildModule("ReceiptModule", (m) => {
  const controller = m.getParameter("CONTROLLER", m.getAccount(0));
  const baseURI = m.getParameter("baseURI_", "");

  const receipt = m.contract("Receipt", [baseURI, controller]);

  return { receipt };
});

export default ReceiptModule;
