// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainlinkModule = buildModule("ChainlinkModule", (m) => {
  const chainlink = m.contract("Chainlink");

  return { chainlink };
});

export default ChainlinkModule;
