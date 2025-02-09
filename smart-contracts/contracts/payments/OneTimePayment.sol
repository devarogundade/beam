// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";
import {BoolLib} from "../libs/BoolLib.sol";
import {HashLib} from "../libs/HashLib.sol";
import {Errors} from "../libs/Errors.sol";

import {IReceipt} from "../interfaces/IReceipt.sol";
import {IOneTimePayment} from "../interfaces/IOneTimePayment.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract OneTimePayment is IOneTimePayment, Ownable {
    IReceipt internal _receipt;
    uint256 internal _lastPaymentId;
    mapping(bytes32 => Types.OneTimePayment) internal _payments;

    string internal constant BASE_HASH_SELECTOR = "OneTimePayment";

    constructor(IReceipt receipt_) Ownable(msg.sender) {
        _receipt = receipt_;
    }

    function create(
        address payer,
        Params.CreateOneTimePayment memory params
    ) external override onlyOwner returns (bytes32 paymentId) {
        _lastPaymentId = _lastPaymentId + 1;

        Types.OneTimePayment memory payment = Types.OneTimePayment({
            payer: payer,
            payers: params.payers,
            merchant: params.merchant,
            amounts: params.amounts,
            fulfillments: new bool[](params.payers.length),
            token: params.token,
            timestamps: new uint256[](params.payers.length),
            description: params.description,
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
    ) external override onlyOwner returns (bool completed, uint256 amount) {
        require(
            _payments[paymentId].status == Enums.PaymentStatus.Active,
            Errors.PAYMENT_NOT_ACTIVE
        );

        uint256 payerIndex = _requirePayerAllowed(paymentId, payer);

        _payments[paymentId].timestamps[payerIndex] = block.timestamp;
        _payments[paymentId].fulfillments[payerIndex] = true;

        completed = BoolLib.every(_payments[paymentId].fulfillments);
        amount = _payments[paymentId].amounts[payerIndex];

        if (mintReceipt) {
            Params.MintReceipt memory mintParams = Params.MintReceipt({
                payer: payer,
                token: _payments[paymentId].token,
                amount: amount,
                timestamp: block.timestamp,
                paymentId: paymentId
            });

            _receipt.mint(mintParams);
        }
    }

    function onComplete(bytes32 paymentId) external override onlyOwner {
        require(
            _payments[paymentId].status == Enums.PaymentStatus.Active,
            Errors.PAYMENT_NOT_ACTIVE
        );

        require(BoolLib.every(_payments[paymentId].fulfillments));

        _payments[paymentId].status = Enums.PaymentStatus.Completed;
    }

    function getPayment(
        bytes32 paymentId
    ) public view override returns (Types.OneTimePayment memory) {
        return _payments[paymentId];
    }

    function getStatus(
        bytes32 paymentId
    ) public view override returns (Enums.PaymentStatus) {
        return _payments[paymentId].status;
    }

    function _requirePayerAllowed(
        bytes32 paymentId,
        address payer
    ) internal view returns (uint256) {
        uint256 payerIndex;
        bool isPayer = false;

        for (
            uint256 index = 0;
            index < _payments[paymentId].payers.length;
            index++
        ) {
            if (payer == _payments[paymentId].payers[index]) {
                payerIndex = index;
                isPayer = true;
                break;
            }
        }

        require(isPayer, Errors.PAYMENT_INVALID_PAYER);

        return payerIndex;
    }
}
