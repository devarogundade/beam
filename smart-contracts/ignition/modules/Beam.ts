// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import AaveV3Module from "./AaveV3";
import UniswapV3Module from "./UniswapV3";
import MerchantModule from "./Merchant";
import OneTimePaymentModule from "./OneTimePayment";
import RecurrentPaymentModule from "./RecurrentPayment";
import HookManagerModule from "./HookManager";
import EventsModule from "./Events";

const BeamModule = buildModule("BeamModule", (m) => {
  const { events } = m.useModule(EventsModule);
  const { merchant } = m.useModule(MerchantModule);
  const { oneTimePayment } = m.useModule(OneTimePaymentModule);
  const { recurrentPayment } = m.useModule(RecurrentPaymentModule);
  const { hookManager } = m.useModule(HookManagerModule);
  const { aaveV3 } = m.useModule(AaveV3Module);
  const { uniswapV3 } = m.useModule(UniswapV3Module);

  const addressLib = m.library("AddressLib");
  const integerLib = m.library("IntegerLib");

  const beam = m.contract(
    "Beam",
    [
      events,
      merchant,
      oneTimePayment,
      recurrentPayment,
      hookManager,
      aaveV3,
      uniswapV3,
    ],
    {
      libraries: {
        AddressLib: addressLib,
        IntegerLib: integerLib,
      },
    }
  );

  m.call(hookManager, "transferOwnership", [beam]);
  m.call(oneTimePayment, "transferOwnership", [beam]);
  m.call(recurrentPayment, "transferOwnership", [beam]);

  return { beam };
});

export default BeamModule;
