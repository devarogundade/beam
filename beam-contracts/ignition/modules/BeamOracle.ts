// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import EventsModule from "./Events";
import { zeroAddress } from "viem";

const ETH = zeroAddress;
const WBTC = "0x5ea79f3190ff37418d42f9b2618688494dbd9693";
const LINK = "0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801";
const USDC = "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d";
const DAI = "0x7984e363c38b590bb4ca35aed5133ef2c6619c40";

const ETH_FEED = "0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41";
const WBTC_FEED = "0x87dce67002e66C17BC0d723Fe20D736b80CAaFda";
const LINK_FEED = "0xaC3E04999aEfE44D508cB3f9B972b0Ecd07c1efb";
const USDC_FEED = "0xFadA8b0737D4A3AE7118918B7E69E689034c0127";
const DAI_FEED = "0x9388954B816B2030B003c81A779316394b3f3f11";

const BeamOracleModule = buildModule("BeamOracleModule", (m) => {
  const chainlink = m.contract("Chainlink");

  m.call(chainlink, "setFeed", [ETH, ETH_FEED], { id: "ETH_FEED" });
  m.call(chainlink, "setFeed", [WBTC, WBTC_FEED], { id: "WBTC_FEED" });
  m.call(chainlink, "setFeed", [LINK, LINK_FEED], { id: "LINK_FEED" });
  m.call(chainlink, "setFeed", [USDC, USDC_FEED], { id: "USDC_FEED" });
  m.call(chainlink, "setFeed", [DAI, DAI_FEED], { id: "DAI_FEED" });

  const beamOracle = m.contract("BeamOracle", [USDC, chainlink]);

  return { chainlink, beamOracle };
});

export default BeamOracleModule;
