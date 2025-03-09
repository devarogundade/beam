// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventsModule = buildModule("EventsModule", (m) => {
    const controller = m.getParameter("CONTROLLER", m.getAccount(0));
    const events = m.contract("Events", [controller]);

    return { events };
});

export default EventsModule;
