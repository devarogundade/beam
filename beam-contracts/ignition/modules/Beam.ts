// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256, stringToBytes, zeroAddress } from "viem";

import AaveV3Module from "./AaveV3";
import UniswapV2Module from "./UniswapV2";
import MerchantModule from "./Merchant";
import OneTimeTransactionModule from "./OneTimeTransaction";
import RecurrentTransactionModule from "./RecurrentTransaction";
import HookManagerModule from "./HookManager";
import EventsModule from "./Events";
import ChainlinkModule from "./Chainlink";
import BeamOracleModule from "./BeamOracle";

const BEAM_ROLE = keccak256(stringToBytes("BEAM_ROLE"));
const HOOK_ROLE = keccak256(stringToBytes("HOOK_ROLE"));
const MERCHANT_ROLE = keccak256(stringToBytes("MERCHANT_ROLE"));

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

const BeamModule = buildModule("BeamModule", (m) => {
  const { events } = m.useModule(EventsModule);
  const { merchant } = m.useModule(MerchantModule);
  const { oneTimeTransaction } = m.useModule(OneTimeTransactionModule);
  const { recurrentTransaction } = m.useModule(RecurrentTransactionModule);
  const { hookManager } = m.useModule(HookManagerModule);
  const { aaveV3 } = m.useModule(AaveV3Module);
  const { uniswapV2 } = m.useModule(UniswapV2Module);
  const { chainlink } = m.useModule(ChainlinkModule);
  const {} = m.useModule(BeamOracleModule);

  const addressLib = m.library("AddressLib");
  const integerLib = m.library("IntegerLib");

  const beam = m.contract(
    "Beam",
    [
      events,
      merchant,
      oneTimeTransaction,
      recurrentTransaction,
      hookManager,
      aaveV3,
      uniswapV2,
    ],
    {
      libraries: {
        AddressLib: addressLib,
        IntegerLib: integerLib,
      },
    }
  );

  m.call(hookManager, "transferOwnership", [beam]);
  m.call(oneTimeTransaction, "transferOwnership", [beam]);
  m.call(recurrentTransaction, "transferOwnership", [beam]);

  m.call(events, "grantRole(address,bytes32)", [beam, BEAM_ROLE], {
    id: "BEAM_ROLE",
  });
  m.call(events, "grantRole(address,bytes32)", [hookManager, HOOK_ROLE], {
    id: "HOOK_ROLE",
  });
  m.call(events, "grantRole(address,bytes32)", [merchant, MERCHANT_ROLE], {
    id: "MERCHANT_ROLE",
  });

  m.call(chainlink, "setFeed", [ETH, ETH_FEED], { id: "ETH_FEED" });
  m.call(chainlink, "setFeed", [WBTC, WBTC_FEED], { id: "WBTC_FEED" });
  m.call(chainlink, "setFeed", [LINK, LINK_FEED], { id: "LINK_FEED" });
  m.call(chainlink, "setFeed", [USDC, USDC_FEED], { id: "USDC_FEED" });
  m.call(chainlink, "setFeed", [DAI, DAI_FEED], { id: "DAI_FEED" });

  return { beam };
});

export default BeamModule;
