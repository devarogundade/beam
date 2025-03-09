// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UNISWAP_ROUTER = "0x0000000000000000000000000000000000000000";
const UNISWAP_QOUTER = "0x0000000000000000000000000000000000000000";

const UniswapV3Module = buildModule("UniswapV3Module", (m) => {
  const router = m.getParameter("router_", UNISWAP_ROUTER);
  const quoter = m.getParameter("quoter_", UNISWAP_QOUTER);

  const uniswapV3 = m.contract("UniswapV3", [router, quoter]);

  return { uniswapV3 };
});

export default UniswapV3Module;
