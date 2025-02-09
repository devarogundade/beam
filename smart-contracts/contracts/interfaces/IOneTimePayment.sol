// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";

interface IOneTimePayment {
    function create(
        address payer,
        Params.CreateOneTimePayment memory params
    ) external returns (bytes32 paymentId);

    function onFulfill(
        bytes32 paymentId,
        address payer,
        bool mintReceipt
    ) external returns (bool completed, uint256 amount);

    function onComplete(bytes32 paymentId) external;

    function getPayment(
        bytes32 paymentId
    ) external view returns (Types.OneTimePayment memory);

    function getStatus(
        bytes32 paymentId
    ) external view returns (Enums.PaymentStatus);
}
