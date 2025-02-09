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
import {IOneTimePayment} from "./interfaces/IOneTimePayment.sol";
import {IRecurrentPayment} from "./interfaces/IRecurrentPayment.sol";

import {IAaveV3} from "./interfaces/IAaveV3.sol";
import {IUniswapV3} from "./interfaces/IUniswapV3.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {BeamHelpers} from "./BeamHelpers.sol";
import {PaymentRouter} from "./PaymentRouter.sol";

contract Beam is Ownable, PaymentRouter, BeamHelpers {
    IBeamEvents internal _events;
    IOneTimePayment internal _oneTimePayment;
    IRecurrentPayment internal _recurrentPayment;

    constructor(
        IBeamEvents events_,
        IMerchant merchant_,
        IOneTimePayment oneTimePayment_,
        IRecurrentPayment recurrentPayment_,
        IHookManager hookManager_,
        IAaveV3 aave_,
        IUniswapV3 uniswap_
    )
        Ownable(msg.sender)
        PaymentRouter(aave_, uniswap_)
        BeamHelpers(merchant_, hookManager_)
    {
        _events = events_;
        _oneTimePayment = oneTimePayment_;
        _recurrentPayment = recurrentPayment_;
    }

    function oneTimePayment(
        Params.CreateOneTimePayment memory params
    ) external payable {
        AddressLib.requireOne(params.merchant);
        AddressLib.requireEvery(params.payers);
        IntegerLib.requireEvery(params.amounts);

        bytes32 paymentId = _oneTimePayment.create(msg.sender, params);

        (bool completed, uint256 amount) = _oneTimePayment.onFulfill(
            paymentId,
            msg.sender,
            params.mintReceipt
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

        Params.RoutePayment memory routePaymentParams = Params.RoutePayment({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routePayment(routePaymentParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            paymentId
        );

        if (completed) _oneTimePayment.onComplete(paymentId);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: params.merchant,
            paymentId: paymentId,
            payer: msg.sender,
            token: params.token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.oneTimePaymentCreated(
            paymentId,
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
            _oneTimePayment.getStatus(paymentId)
        );
    }

    function fulfillOneTimePayment(
        Params.FulfillOneTimePayment memory params
    ) external payable {
        Types.OneTimePayment memory payment = _oneTimePayment.getPayment(
            params.paymentId
        );

        (bool completed, uint256 amount) = _oneTimePayment.onFulfill(
            params.paymentId,
            msg.sender,
            params.mintReceipt
        );

        address wallet = _merchant.getWallet(payment.merchant);
        AddressLib.requireOne(wallet);

        Params.BeforePayment memory beforePaymentParams = Params.BeforePayment({
            merchant: payment.merchant,
            payer: msg.sender,
            token: payment.token,
            amount: amount
        });

        _hookManager.beforePayment(beforePaymentParams);

        Params.AdjustTokenAmount memory adjustTokenAmountParams = Params
            .AdjustTokenAmount({
                merchant: payment.merchant,
                payer: msg.sender,
                token: payment.token,
                amount: amount
            });

        (address adjustedToken, uint256 adjustedAmount) = _hookManager
            .adjustTokenAmount(adjustTokenAmountParams);

        Params.RoutePayment memory routePaymentParams = Params.RoutePayment({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routePayment(routePaymentParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            params.paymentId
        );

        if (completed) _oneTimePayment.onComplete(params.paymentId);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: payment.merchant,
            paymentId: params.paymentId,
            payer: msg.sender,
            token: payment.token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.oneTimePaymentFulfilled(
            params.paymentId,
            msg.sender,
            payment.merchant,
            payment.token,
            amount,
            adjustedToken,
            adjustedAmount,
            block.timestamp,
            _oneTimePayment.getStatus(params.paymentId)
        );
    }

    function recurrentPayment(
        Params.CreateRecurrentPayment memory params
    ) external payable {
        AddressLib.requireOne(params.merchant);

        bytes32 paymentId = _recurrentPayment.create(msg.sender, params);

        (uint256 amount, address token, uint256 dueDate) = _recurrentPayment
            .onFulfill(paymentId, msg.sender, params.mintReceipt);

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

        Params.RoutePayment memory routePaymentParams = Params.RoutePayment({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routePayment(routePaymentParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            paymentId
        );

        _recurrentPayment.onComplete(paymentId, amount);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: params.merchant,
            paymentId: paymentId,
            payer: msg.sender,
            token: token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.recurrentPaymentCreated(
            paymentId,
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
            _recurrentPayment.getStatus(paymentId)
        );
    }

    function fulfillRecurrentPayment(
        Params.FulfillRecurrentPayment memory params
    ) external payable {
        Types.RecurrentPayment memory payment = _recurrentPayment.getPayment(
            params.paymentId
        );

        (uint256 amount, address token, uint256 dueDate) = _recurrentPayment
            .onFulfill(params.paymentId, msg.sender, params.mintReceipt);

        address wallet = _merchant.getWallet(payment.merchant);
        AddressLib.requireOne(wallet);

        Params.BeforePayment memory beforePaymentParams = Params.BeforePayment({
            merchant: payment.merchant,
            payer: msg.sender,
            token: token,
            amount: amount
        });

        _hookManager.beforePayment(beforePaymentParams);

        Params.AdjustTokenAmount memory adjustTokenAmountParams = Params
            .AdjustTokenAmount({
                merchant: payment.merchant,
                payer: msg.sender,
                token: token,
                amount: amount
            });

        (address adjustedToken, uint256 adjustedAmount) = _hookManager
            .adjustTokenAmount(adjustTokenAmountParams);

        Params.RoutePayment memory routePaymentParams = Params.RoutePayment({
            token: adjustedToken,
            tokenB: params.tokenB,
            amount: adjustedAmount,
            wallet: wallet,
            healthFactorMultiplier: params.healthFactorMultiplier,
            route: params.route,
            signature: params.signature
        });

        _routePayment(routePaymentParams);

        IWallet(wallet).deposit{value: msg.value}(
            adjustedToken,
            adjustedAmount,
            params.paymentId
        );

        _recurrentPayment.onComplete(params.paymentId, amount);

        Params.AfterPayment memory afterPaymentParams = Params.AfterPayment({
            merchant: payment.merchant,
            paymentId: params.paymentId,
            payer: msg.sender,
            token: token,
            amount: amount,
            adjustedToken: adjustedToken,
            adjustedAmount: adjustedAmount
        });

        _hookManager.afterPayment(afterPaymentParams);

        _events.recurrentPaymentFulfilled(
            params.paymentId,
            msg.sender,
            payment.merchant,
            dueDate,
            token,
            amount,
            adjustedToken,
            adjustedAmount,
            block.timestamp,
            _recurrentPayment.getStatus(params.paymentId)
        );
    }

    function cancelRecurrentPayment(
        Params.CancelRecurrentPayment memory params
    ) external {
        _recurrentPayment.onCancel(msg.sender, params.paymentId);

        _events.recurrentPaymentCancelled(params.paymentId);
    }
}
