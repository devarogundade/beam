// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "./libs/Enums.sol";
import {Types} from "./libs/Types.sol";
import {Params} from "./libs/Params.sol";

import {AddressLib} from "./libs/AddressLib.sol";
import {IntegerLib} from "./libs/IntegerLib.sol";

import {IWallet} from "./interfaces/IWallet.sol";
import {IMerchant} from "./interfaces/IMerchant.sol";
import {IBeamEvents} from "./events/IBeamEvents.sol";
import {IHookManager} from "./interfaces/IHookManager.sol";
import {IOneTimeTransaction} from "./interfaces/IOneTimeTransaction.sol";
import {IRecurrentTransaction} from "./interfaces/IRecurrentTransaction.sol";

import {IAaveV3} from "./interfaces/IAaveV3.sol";
import {IUniswap} from "./interfaces/IUniswap.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {BeamHelpers} from "./BeamHelpers.sol";
import {TransactionRouter} from "./TransactionRouter.sol";

contract Beam is Ownable, TransactionRouter, BeamHelpers {
    IBeamEvents internal _events;
    IOneTimeTransaction internal _oneTimeTransaction;
    IRecurrentTransaction internal _recurrentTransaction;

    constructor(
        IBeamEvents events_,
        IMerchant merchant_,
        IOneTimeTransaction oneTimeTransaction_,
        IRecurrentTransaction recurrentTransaction_,
        IHookManager hookManager_,
        IAaveV3 aave_,
        IUniswap uniswap_
    )
        Ownable(msg.sender)
        TransactionRouter(aave_, uniswap_)
        BeamHelpers(merchant_, hookManager_)
    {
        _events = events_;
        _oneTimeTransaction = oneTimeTransaction_;
        _recurrentTransaction = recurrentTransaction_;
    }

    function oneTimeTransaction(
        Params.CreateOneTimeTransaction memory params
    ) external payable {
        AddressLib.requireOne(params.merchant);
        AddressLib.requireEvery(params.payers);
        IntegerLib.requireEvery(params.amounts);

        bytes32 transactionId = _oneTimeTransaction.create(msg.sender, params);

        (bool completed, uint256 amount) = _oneTimeTransaction.onFulfill(
            transactionId,
            msg.sender
        );

        address wallet = _merchant.getWallet(params.merchant);
        AddressLib.requireOne(wallet);

        Params.BeforePayment memory beforePaymentParams = Params.BeforePayment({
            merchant: params.merchant,
            payer: msg.sender,
            token: params.token,
            amount: amount
        });

        _hookManager.beforePayment(beforePaymentParams);

        Params.AdjustTokenAmount memory adjustTokenAmountParams = Params
            .AdjustTokenAmount({
                merchant: params.merchant,
                payer: msg.sender,
                token: params.token,
                amount: amount
            });

        (address adjustedToken, uint256 adjustedAmount) = _hookManager
            .adjustTokenAmount(adjustTokenAmountParams);

        Params.RouteTransaction memory routeParams = Params.RouteTransaction({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            slippage: params.slippage,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routeTransaction(routeParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            transactionId
        );

        if (completed) _oneTimeTransaction.onComplete(transactionId);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: params.merchant,
            transactionId: transactionId,
            payer: msg.sender,
            token: params.token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.oneTimeTransactionCreated(
            transactionId,
            msg.sender,
            params.payers,
            params.merchant,
            params.token,
            params.amounts,
            adjustedToken,
            adjustedAmount,
            block.timestamp,
            params.description,
            params.metadata,
            _oneTimeTransaction.getStatus(transactionId)
        );
    }

    function fulfillOneTimeTransaction(
        Params.FulfillOneTimeTransaction memory params
    ) external payable {
        Types.OneTimeTransaction memory transaction = _oneTimeTransaction
            .getTransaction(params.transactionId);

        (bool completed, uint256 amount) = _oneTimeTransaction.onFulfill(
            params.transactionId,
            msg.sender
        );

        address wallet = _merchant.getWallet(transaction.merchant);
        AddressLib.requireOne(wallet);

        Params.BeforePayment memory beforePaymentParams = Params.BeforePayment({
            merchant: transaction.merchant,
            payer: msg.sender,
            token: transaction.token,
            amount: amount
        });

        _hookManager.beforePayment(beforePaymentParams);

        Params.AdjustTokenAmount memory adjustTokenAmountParams = Params
            .AdjustTokenAmount({
                merchant: transaction.merchant,
                payer: msg.sender,
                token: transaction.token,
                amount: amount
            });

        (address adjustedToken, uint256 adjustedAmount) = _hookManager
            .adjustTokenAmount(adjustTokenAmountParams);

        Params.RouteTransaction memory routeParams = Params.RouteTransaction({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            slippage: params.slippage,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routeTransaction(routeParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            params.transactionId
        );

        if (completed) _oneTimeTransaction.onComplete(params.transactionId);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: transaction.merchant,
            transactionId: params.transactionId,
            payer: msg.sender,
            token: transaction.token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.oneTimeTransactionFulfilled(
            params.transactionId,
            msg.sender,
            transaction.merchant,
            transaction.token,
            amount,
            adjustedToken,
            adjustedAmount,
            block.timestamp,
            _oneTimeTransaction.getStatus(params.transactionId)
        );
    }

    function recurrentTransaction(
        Params.CreateRecurrentTransaction memory params
    ) external payable {
        AddressLib.requireOne(params.merchant);

        bytes32 transactionId = _recurrentTransaction.create(
            msg.sender,
            params
        );

        (uint256 amount, address token, uint256 dueDate) = _recurrentTransaction
            .onFulfill(transactionId, msg.sender);

        address wallet = _merchant.getWallet(params.merchant);
        AddressLib.requireOne(wallet);

        Params.BeforePayment memory beforePaymentParams = Params.BeforePayment({
            merchant: params.merchant,
            payer: msg.sender,
            token: token,
            amount: amount
        });

        _hookManager.beforePayment(beforePaymentParams);

        Params.AdjustTokenAmount memory adjustTokenAmountParams = Params
            .AdjustTokenAmount({
                merchant: params.merchant,
                payer: msg.sender,
                token: token,
                amount: amount
            });

        (address adjustedToken, uint256 adjustedAmount) = _hookManager
            .adjustTokenAmount(adjustTokenAmountParams);

        Params.RouteTransaction memory routeParams = Params.RouteTransaction({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            slippage: params.slippage,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routeTransaction(routeParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            transactionId
        );

        _recurrentTransaction.onComplete(transactionId, amount);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: params.merchant,
            transactionId: transactionId,
            payer: msg.sender,
            token: token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.recurrentTransactionCreated(
            transactionId,
            msg.sender,
            params.merchant,
            dueDate,
            token,
            amount,
            adjustedToken,
            adjustedAmount,
            block.timestamp,
            params.description,
            params.metadata,
            _recurrentTransaction.getStatus(transactionId)
        );
    }

    function fulfillRecurrentTransaction(
        Params.FulfillRecurrentTransaction memory params
    ) external payable {
        Types.RecurrentTransaction memory transaction = _recurrentTransaction
            .getTransaction(params.transactionId);

        (uint256 amount, address token, uint256 dueDate) = _recurrentTransaction
            .onFulfill(params.transactionId, msg.sender);

        address wallet = _merchant.getWallet(transaction.merchant);
        AddressLib.requireOne(wallet);

        Params.BeforePayment memory beforePaymentParams = Params.BeforePayment({
            merchant: transaction.merchant,
            payer: msg.sender,
            token: token,
            amount: amount
        });

        _hookManager.beforePayment(beforePaymentParams);

        Params.AdjustTokenAmount memory adjustTokenAmountParams = Params
            .AdjustTokenAmount({
                merchant: transaction.merchant,
                payer: msg.sender,
                token: token,
                amount: amount
            });

        (address adjustedToken, uint256 adjustedAmount) = _hookManager
            .adjustTokenAmount(adjustTokenAmountParams);

        Params.RouteTransaction memory routeParams = Params.RouteTransaction({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            slippage: params.slippage,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routeTransaction(routeParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            params.transactionId
        );

        _recurrentTransaction.onComplete(params.transactionId, amount);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: transaction.merchant,
            transactionId: params.transactionId,
            payer: msg.sender,
            token: token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.recurrentTransactionFulfilled(
            params.transactionId,
            msg.sender,
            transaction.merchant,
            dueDate,
            token,
            amount,
            adjustedToken,
            adjustedAmount,
            block.timestamp,
            _recurrentTransaction.getStatus(params.transactionId)
        );
    }

    function cancelRecurrentTransaction(
        Params.CancelRecurrentTransaction memory params
    ) external {
        _recurrentTransaction.onCancel(msg.sender, params.transactionId);

        _events.recurrentTransactionCancelled(params.transactionId);
    }

    function mintOneTimeTransactionReceipt(
        Params.MintReceipt memory params
    ) external {
        _oneTimeTransaction.mintReceipt(params);
    }

    function mintRecurrentTransactionReceipt(
        Params.MintReceipt memory params
    ) external {
        _recurrentTransaction.mintReceipt(params);
    }

    function setOneTimeTransaction(
        IOneTimeTransaction transaction
    ) external onlyOwner {
        _oneTimeTransaction = transaction;
    }

    function setRecurentTransaction(
        IRecurrentTransaction transaction
    ) external onlyOwner {
        _recurrentTransaction = transaction;
    }

    function setAave(IAaveV3 aave) external onlyOwner {
        _setAave(aave);
    }

    function setUniswap(IUniswap uniswap) external onlyOwner {
        _setUniswap(uniswap);
    }
}
