// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";

interface IRecurrentPayment {
    function create(
        address payer,
        Params.CreateRecurrentPayment memory params
    ) external returns (bytes32 paymentId);

    function onFulfill(
        bytes32 paymentId,
        address payer,
        bool mintReceipt
    ) external returns (uint256 amount, address token, uint256 dueDate);

    function onComplete(bytes32 paymentId, uint256 amount) external;

    function onCancel(address payer, bytes32 paymentId) external;

    function getPayment(
        bytes32 paymentId
    ) external view returns (Types.RecurrentPayment memory);

    function getStatus(
        bytes32 paymentId
    ) external view returns (Enums.PaymentStatus);
}
