// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import EventsModule from "./Events";

const HookManagerModule = buildModule("HookManagerModule", (m) => {
  const { events } = m.useModule(EventsModule);

  const addressLib = m.library("AddressLib");

  const hookManager = m.contract("HookManager", [events], {
    libraries: {
      AddressLib: addressLib,
    },
  });

  return { hookManager };
});

export default HookManagerModule;
