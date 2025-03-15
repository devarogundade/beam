// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ChainlinkModule from "./Chainlink";

const BeamOracleModule = buildModule("BeamOracleModule", (m) => {
  const { chainlink } = m.useModule(ChainlinkModule);

  const beamOracle = m.contract("BeamOracle", [chainlink]);

  return { beamOracle };
});

export default BeamOracleModule;
