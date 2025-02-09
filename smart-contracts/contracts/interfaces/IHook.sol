// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Types} from "../libs/Types.sol";

interface IHook {
    function onRegister() external returns (Types.HookConfig memory);

    function onUnRegister() external;

    function onBeforePayment(
        address payer,
        address token,
        uint256 amount
    ) external;

    function onAfterPayment(
        bytes32 paymentId,
        address payer,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount
    ) external;

    function onAdjustTokenAmount(
        address payer,
        address token,
        uint256 amount
    ) external view returns (address adjustedToken, uint256 adjustedAmount);
}
