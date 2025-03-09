// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";

interface IBeamEvents {
    event OneTimeTransactionCreated(
        bytes32 transactionId,
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
        Enums.TransactionStatus status
    );

    event OneTimeTransactionFulfilled(
        bytes32 transactionId,
        address payer,
        address merchant,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.TransactionStatus status
    );

    event RecurrentTransactionCreated(
        bytes32 transactionId,
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
        Enums.TransactionStatus status
    );

    event RecurrentTransactionFulfilled(
        bytes32 transactionId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.TransactionStatus status
    );

    event RecurrentTransactionCancelled(bytes32 transactionId);

    function oneTimeTransactionCreated(
        bytes32 transactionId,
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
        Enums.TransactionStatus status
    ) external;

    function oneTimeTransactionFulfilled(
        bytes32 transactionId,
        address payer,
        address merchant,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.TransactionStatus status
    ) external;

    function recurrentTransactionCreated(
        bytes32 transactionId,
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
        Enums.TransactionStatus status
    ) external;

    function recurrentTransactionFulfilled(
        bytes32 transactionId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.TransactionStatus status
    ) external;

    function recurrentTransactionCancelled(bytes32 transactionId) external;
}
