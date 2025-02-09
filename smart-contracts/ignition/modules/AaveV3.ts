// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AAVE_WETH_GATEWAY = "0x57ce905CfD7f986A929A26b006f797d181dB706e";
const AAVE_ADDRESSES_PROVIDER = "0x52A27dC690F8652288194Dd2bc523863eBdEa236";

const AaveV3Module = buildModule("AaveV3Module", (m) => {
  const wethGateway = m.getParameter("wethGateway_", AAVE_WETH_GATEWAY);
  const poolAddressesProvider = m.getParameter(
    "poolAddressesProvider_",
    AAVE_ADDRESSES_PROVIDER
  );

  const aaveV3 = m.contract("AaveV3", [wethGateway, poolAddressesProvider]);

  return { aaveV3 };
});

export default AaveV3Module;
