// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";
import {BoolLib} from "../libs/BoolLib.sol";
import {HashLib} from "../libs/HashLib.sol";
import {Errors} from "../libs/Errors.sol";

import {IReceipt} from "../interfaces/IReceipt.sol";
import {IOneTimeTransaction} from "../interfaces/IOneTimeTransaction.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract OneTimeTransaction is IOneTimeTransaction, Ownable {
    IReceipt internal _receipt;
    uint256 internal _lastTransactionId;
    mapping(bytes32 => Types.OneTimeTransaction) internal _transactions;

    string internal constant BASE_HASH_SELECTOR = "OneTimeTransaction";

    constructor(IReceipt receipt_) Ownable(msg.sender) {
        _receipt = receipt_;
    }

    function create(
        address payer,
        Params.CreateOneTimeTransaction memory params
    ) external override onlyOwner returns (bytes32 transactionId) {
        _lastTransactionId = _lastTransactionId + 1;

        Types.OneTimeTransaction memory transaction = Types.OneTimeTransaction({
            payer: payer,
            payers: params.payers,
            merchant: params.merchant,
            amounts: params.amounts,
            fulfillments: new bool[](params.payers.length),
            token: params.token,
            timestamps: new uint256[](params.payers.length),
            description: params.description,
            metadata: params.metadata,
            status: Enums.TransactionStatus.Active
        });

        transactionId = HashLib.generate(
            BASE_HASH_SELECTOR,
            _lastTransactionId
        );
        _transactions[transactionId] = transaction;
    }

    function onFulfill(
        bytes32 transactionId,
        address payer
    ) external override onlyOwner returns (bool completed, uint256 amount) {
        require(
            _transactions[transactionId].status ==
                Enums.TransactionStatus.Active,
            Errors.TRANSACTION_NOT_ACTIVE
        );

        uint256 payerIndex = _requirePayerAllowed(transactionId, payer);

        _transactions[transactionId].timestamps[payerIndex] = block.timestamp;
        _transactions[transactionId].fulfillments[payerIndex] = true;

        completed = BoolLib.every(_transactions[transactionId].fulfillments);
        amount = _transactions[transactionId].amounts[payerIndex];
    }

    function onComplete(bytes32 transactionId) external override onlyOwner {
        require(
            _transactions[transactionId].status ==
                Enums.TransactionStatus.Active,
            Errors.TRANSACTION_NOT_ACTIVE
        );

        require(BoolLib.every(_transactions[transactionId].fulfillments));

        _transactions[transactionId].status = Enums.TransactionStatus.Completed;
    }

    function mintReceipt(
        Params.MintReceipt memory params
    ) external override onlyOwner {
        _receipt.mint(params);
    }

    function getTransaction(
        bytes32 transactionId
    ) public view override returns (Types.OneTimeTransaction memory) {
        return _transactions[transactionId];
    }

    function getStatus(
        bytes32 transactionId
    ) public view override returns (Enums.TransactionStatus) {
        return _transactions[transactionId].status;
    }

    function _requirePayerAllowed(
        bytes32 transactionId,
        address payer
    ) internal view returns (uint256) {
        uint256 payerIndex;
        bool isPayer = false;

        for (
            uint256 index = 0;
            index < _transactions[transactionId].payers.length;
            index++
        ) {
            if (payer == _transactions[transactionId].payers[index]) {
                payerIndex = index;
                isPayer = true;
                break;
            }
        }

        require(isPayer, Errors.TRANSACTION_INVALID_PAYER);

        return payerIndex;
    }
}
