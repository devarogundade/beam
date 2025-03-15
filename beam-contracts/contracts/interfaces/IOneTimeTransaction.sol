// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";

interface IOneTimeTransaction {
    function create(
        address payer,
        Params.CreateOneTimeTransaction memory params
    ) external returns (bytes32 transactionId);

    function onFulfill(
        bytes32 transactionId,
        address payer
    ) external returns (bool completed, uint256 amount);

    function onComplete(bytes32 transactionId) external;

    function mintReceipt(Params.MintReceipt memory params) external;

    function getTransaction(
        bytes32 transactionId
    ) external view returns (Types.OneTimeTransaction memory);

    function getStatus(
        bytes32 transactionId
    ) external view returns (Enums.TransactionStatus);
}
