// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";

interface IRecurrentTransaction {
    function create(
        address payer,
        Params.CreateRecurrentTransaction memory params
    ) external returns (bytes32 transactionId);

    function onFulfill(
        bytes32 transactionId,
        address payer,
        bool mintReceipt
    ) external returns (uint256 amount, address token, uint256 dueDate);

    function onComplete(bytes32 transactionId, uint256 amount) external;

    function onCancel(address payer, bytes32 transactionId) external;

    function mintReceipt(Params.MintReceipt memory params) external;

    function getTransaction(
        bytes32 transactionId
    ) external view returns (Types.RecurrentTransaction memory);

    function getStatus(
        bytes32 transactionId
    ) external view returns (Enums.TransactionStatus);
}
