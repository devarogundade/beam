// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";
import {HashLib} from "../libs/HashLib.sol";
import {Errors} from "../libs/Errors.sol";

import {IReceipt} from "../interfaces/IReceipt.sol";
import {IMerchant} from "../interfaces/IMerchant.sol";
import {IRecurrentPayment} from "../interfaces/IRecurrentPayment.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RecurrentPayment is IRecurrentPayment, Ownable {
    IReceipt internal _receipt;
    IMerchant internal _merchant;
    uint256 internal _lastPaymentId;
    mapping(bytes32 => Types.RecurrentPayment) internal _payments;

    string internal constant BASE_HASH_SELECTOR = "RecurrentPayment";

    constructor(IReceipt receipt_, IMerchant merchant_) Ownable(msg.sender) {
        _receipt = receipt_;
        _merchant = merchant_;
    }

    function create(
        address payer,
        Params.CreateRecurrentPayment memory params
    ) external override onlyOwner returns (bytes32 paymentId) {
        _lastPaymentId = _lastPaymentId + 1;

        Types.RecurrentPayment memory payment = Types.RecurrentPayment({
            payer: payer,
            merchant: params.merchant,
            subscriptionId: params.subscriptionId,
            description: params.description,
            timestamps: new uint256[](0),
            amounts: new uint256[](0),
            dueDate: block.timestamp,
            metadata: params.metadata,
            status: Enums.PaymentStatus.Active
        });

        paymentId = HashLib.generate(BASE_HASH_SELECTOR, _lastPaymentId);
        _payments[paymentId] = payment;
    }

    function onFulfill(
        bytes32 paymentId,
        address payer,
        bool mintReceipt
    )
        external
        override
        onlyOwner
        returns (uint256 amount, address token, uint256 dueDate)
    {
        require(
            _payments[paymentId].status == Enums.PaymentStatus.Active,
            Errors.PAYMENT_NOT_ACTIVE
        );
        require(
            _payments[paymentId].payer == payer,
            Errors.PAYMENT_INVALID_PAYER
        );

        Types.Subscription memory subscription = _merchant.getSubscription(
            _payments[paymentId].subscriptionId
        );

        require(subscription.active, Errors.SUBSCRIPTION_INACTIVE);

        if (block.timestamp > _payments[paymentId].dueDate) {
            dueDate = block.timestamp;
        } else {
            dueDate = _payments[paymentId].dueDate;
        }

        dueDate = dueDate + subscription.interval;

        _payments[paymentId].dueDate = dueDate;

        amount = subscription.amount;
        token = subscription.token;

        if (mintReceipt) {
            Params.MintReceipt memory mintParams = Params.MintReceipt({
                payer: payer,
                token: token,
                amount: amount,
                timestamp: block.timestamp,
                paymentId: paymentId
            });

            _receipt.mint(mintParams);
        }
    }

    function onComplete(
        bytes32 paymentId,
        uint256 amount
    ) external override onlyOwner {
        require(
            _payments[paymentId].status == Enums.PaymentStatus.Active,
            Errors.PAYMENT_NOT_ACTIVE
        );

        _payments[paymentId].timestamps.push(block.timestamp);
        _payments[paymentId].amounts.push(amount);
    }

    function onCancel(
        address payer,
        bytes32 paymentId
    ) external override onlyOwner {
        require(
            _payments[paymentId].status == Enums.PaymentStatus.Active,
            Errors.PAYMENT_NOT_ACTIVE
        );
        require(
            _payments[paymentId].payer == payer,
            Errors.PAYMENT_INVALID_PAYER
        );

        _payments[paymentId].status = Enums.PaymentStatus.Cancelled;
    }

    function getPayment(
        bytes32 paymentId
    ) public view override returns (Types.RecurrentPayment memory) {
        return _payments[paymentId];
    }

    function getStatus(
        bytes32 paymentId
    ) public view override returns (Enums.PaymentStatus) {
        return _payments[paymentId].status;
    }
}
