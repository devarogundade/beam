// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import EventsModule from "./Events";

const MerchantModule = buildModule("MerchantModule", (m) => {
  const hashLib = m.library("HashLib");
  const { events } = m.useModule(EventsModule);

  const merchant = m.contract("Merchant", [events, events], {
    libraries: {
      HashLib: hashLib,
    },
  });

  return { merchant };
});

export default MerchantModule;
