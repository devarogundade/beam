// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UNISWAP_ROUTER = "0xbc78af4aab3d93b171190abaef94bba95dd43122";

const UniswapV2Module = buildModule("UniswapV2Module", (m) => {
  const router = m.getParameter("router_", UNISWAP_ROUTER);

  const uniswapV2 = m.contract("UniswapV2", [router]);

  return { uniswapV2 };
});

export default UniswapV2Module;
