// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";

interface IBeamEvents {
    event OneTimePaymentCreated(
        bytes32 paymentId,
        address payer,
        address[] payers,
        address merchant,
        address token,
        uint256[] amounts,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        string description,
        Types.Metadata metadata,
        Enums.PaymentStatus status
    );

    event OneTimePaymentFulfilled(
        bytes32 paymentId,
        address payer,
        address merchant,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.PaymentStatus status
    );

    event RecurrentPaymentCreated(
        bytes32 paymentId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        string description,
        Types.Metadata metadata,
        Enums.PaymentStatus status
    );

    event RecurrentPaymentFulfilled(
        bytes32 paymentId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.PaymentStatus status
    );

    event RecurrentPaymentCancelled(bytes32 paymentId);

    function oneTimePaymentCreated(
        bytes32 paymentId,
        address payer,
        address[] calldata payers,
        address merchant,
        address token,
        uint256[] calldata amounts,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        string calldata description,
        Types.Metadata calldata metadata,
        Enums.PaymentStatus status
    ) external;

    function oneTimePaymentFulfilled(
        bytes32 paymentId,
        address payer,
        address merchant,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.PaymentStatus status
    ) external;

    function recurrentPaymentCreated(
        bytes32 paymentId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        string calldata description,
        Types.Metadata calldata metadata,
        Enums.PaymentStatus status
    ) external;

    function recurrentPaymentFulfilled(
        bytes32 paymentId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.PaymentStatus status
    ) external;

    function recurrentPaymentCancelled(bytes32 paymentId) external;
}
