// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IHookEvents {
    event HookRegistered(address indexed merchant, address hook);

    event HookUnRegistered(address indexed merchant, address hook);

    function hookRegistered(address merchant, address hook) external;

    function hookUnRegistered(address merchant, address hook) external;
}
