// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";
import {HashLib} from "../libs/HashLib.sol";
import {Errors} from "../libs/Errors.sol";

import {IReceipt} from "../interfaces/IReceipt.sol";
import {IMerchant} from "../interfaces/IMerchant.sol";
import {IRecurrentTransaction} from "../interfaces/IRecurrentTransaction.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RecurrentTransaction is IRecurrentTransaction, Ownable {
    IReceipt internal _receipt;
    IMerchant internal _merchant;
    uint256 internal _lastTransactionId;
    mapping(bytes32 => Types.RecurrentTransaction) internal _transactions;

    string internal constant BASE_HASH_SELECTOR = "RecurrentTransaction";

    constructor(IReceipt receipt_, IMerchant merchant_) Ownable(msg.sender) {
        _receipt = receipt_;
        _merchant = merchant_;
    }

    function create(
        address payer,
        Params.CreateRecurrentTransaction memory params
    ) external override onlyOwner returns (bytes32 transactionId) {
        _lastTransactionId = _lastTransactionId + 1;

        Types.RecurrentTransaction memory transaction = Types
            .RecurrentTransaction({
                payer: payer,
                merchant: params.merchant,
                subscriptionId: params.subscriptionId,
                description: params.description,
                timestamps: new uint256[](0),
                amounts: new uint256[](0),
                dueDate: block.timestamp,
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
    )
        external
        override
        onlyOwner
        returns (uint256 amount, address token, uint256 dueDate)
    {
        require(
            _transactions[transactionId].status ==
                Enums.TransactionStatus.Active,
            Errors.TRANSACTION_NOT_ACTIVE
        );
        require(
            _transactions[transactionId].payer == payer,
            Errors.TRANSACTION_INVALID_PAYER
        );

        Types.Subscription memory subscription = _merchant.getSubscription(
            _transactions[transactionId].subscriptionId
        );

        require(subscription.active, Errors.SUBSCRIPTION_INACTIVE);

        if (block.timestamp > _transactions[transactionId].dueDate) {
            dueDate = block.timestamp;
        } else {
            dueDate = _transactions[transactionId].dueDate;
        }

        dueDate = dueDate + subscription.interval;

        _transactions[transactionId].dueDate = dueDate;

        amount = subscription.amount;
        token = subscription.token;
    }

    function onComplete(
        bytes32 transactionId,
        uint256 amount
    ) external override onlyOwner {
        require(
            _transactions[transactionId].status ==
                Enums.TransactionStatus.Active,
            Errors.TRANSACTION_NOT_ACTIVE
        );

        _transactions[transactionId].timestamps.push(block.timestamp);
        _transactions[transactionId].amounts.push(amount);
    }

    function onCancel(
        address payer,
        bytes32 transactionId
    ) external override onlyOwner {
        require(
            _transactions[transactionId].status ==
                Enums.TransactionStatus.Active,
            Errors.TRANSACTION_NOT_ACTIVE
        );
        require(
            _transactions[transactionId].payer == payer,
            Errors.TRANSACTION_INVALID_PAYER
        );

        _transactions[transactionId].status = Enums.TransactionStatus.Cancelled;
    }

    function mintReceipt(
        Params.MintReceipt memory params
    ) external override onlyOwner {
        _receipt.mint(params);
    }

    function getTransaction(
        bytes32 transactionId
    ) public view override returns (Types.RecurrentTransaction memory) {
        return _transactions[transactionId];
    }

    function getStatus(
        bytes32 transactionId
    ) public view override returns (Enums.TransactionStatus) {
        return _transactions[transactionId].status;
    }
}
