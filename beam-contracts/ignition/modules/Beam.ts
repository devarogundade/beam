// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256, stringToBytes } from "viem";

import AaveV3Module from "./AaveV3";
import UniswapV2Module from "./UniswapV2";
import MerchantModule from "./Merchant";
import OneTimeTransactionModule from "./OneTimeTransaction";
import RecurrentTransactionModule from "./RecurrentTransaction";
import HookManagerModule from "./HookManager";
import EventsModule from "./Events";

const BEAM_ROLE = keccak256(stringToBytes("BEAM_ROLE"));
const HOOK_ROLE = keccak256(stringToBytes("HOOK_ROLE"));
const MERCHANT_ROLE = keccak256(stringToBytes("MERCHANT_ROLE"));

const BeamModule = buildModule("BeamModule", (m) => {
  const { events } = m.useModule(EventsModule);
  const { merchant } = m.useModule(MerchantModule);
  const { oneTimeTransaction } = m.useModule(OneTimeTransactionModule);
  const { recurrentTransaction } = m.useModule(RecurrentTransactionModule);
  const { hookManager } = m.useModule(HookManagerModule);
  const { aaveV3 } = m.useModule(AaveV3Module);
  const { uniswapV2 } = m.useModule(UniswapV2Module);

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

  m.call(
    beam,
    "oneTimeTransaction",
    [
      {
        amounts: [2000000n],
        description: "",
        healthFactorMultiplier: 0n,
        merchant: "0x3E646e062F05e01e1860eA53a6DC81e7E9162DE6",
        metadata: {
          schemaVersion: 1,
          value: '{"buyer":"daa","amountInUsd":true}',
        },
        mintReceipt: false,
        payers: [m.getAccount(0)],
        route: 0,
        signature: {
          deadline: 0,
          v: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000000",
          s: "0x0000000000000000000000000000000000000000000000000000000000000000",
        },
        token: "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d",
        tokenB: "0x0000000000000000000000000000000000000000",
      },
    ],
    { id: "test2" }
  );

  return { beam };
});

export default BeamModule;
