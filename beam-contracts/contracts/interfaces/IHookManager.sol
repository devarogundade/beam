// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";

interface IHookManager {
    function register(Params.RegisterHook memory params) external;

    function unRegister() external;

    function beforePayment(Params.BeforePayment memory params) external;

    function afterPayment(Params.AfterPayment memory params) external;

    function adjustTokenAmount(
        Params.AdjustTokenAmount memory params
    ) external view returns (address adjustedToken, uint256 adjustedAmount);

    function getHook(address merchant) external view returns (address);
}
