// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "./libs/Enums.sol";
import {Params} from "./libs/Params.sol";
import {Errors} from "./libs/Errors.sol";

import {IAaveV3} from "./interfaces/IAaveV3.sol";
import {IUniswap} from "./interfaces/IUniswap.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract TransactionRouter {
    IAaveV3 internal _aave;
    IUniswap internal _uniswap;

    constructor(IAaveV3 aave_, IUniswap uniswap_) {
        _aave = aave_;
        _uniswap = uniswap_;
    }

    function _routePayment(Params.RoutePayment memory params) internal {
        uint256 payerBalance = 0;

        if (params.token == address(0)) {
            payerBalance = payable(msg.sender).balance;
        } else {
            payerBalance = IERC20(params.token).balanceOf(msg.sender);
        }

        if (payerBalance >= params.amount) {
            if (params.token == address(0)) {
                require(
                    msg.value >= params.amount,
                    Errors.INSUFFICIENT_BALANCE
                );
            } else {
                IERC20(params.token).transferFrom(
                    msg.sender,
                    address(this),
                    params.amount
                );
            }

            return _afterRoute(params.token, params.amount, params.wallet);
        } else {
            if (params.token == address(0)) {
                require(msg.value <= payerBalance, Errors.INSUFFICIENT_BALANCE);
            } else {
                IERC20(params.token).transferFrom(
                    msg.sender,
                    address(this),
                    payerBalance
                );
            }
        }

        if (params.token == address(0)) {
            require(msg.value >= payerBalance, Errors.INSUFFICIENT_BALANCE);
        } else {
            IERC20(params.token).transferFrom(
                msg.sender,
                address(this),
                payerBalance
            );
        }

        uint256 amountLeft = params.amount - payerBalance;

        if (params.route == Enums.TransactionRoute.Uniswap) {
            Params.RequiredAmountIn memory amountInParams = Params
                .RequiredAmountIn({
                    tokenIn: params.tokenB,
                    tokenOut: params.token,
                    amountOut: amountLeft
                });

            uint256 amountIn = _uniswap.requiredAmountIn(amountInParams);

            Params.ExecuteSwap memory executeParams = Params.ExecuteSwap({
                tokenIn: params.tokenB,
                tokenOut: params.token,
                amountIn: amountIn,
                amountOutMin: amountLeft
            });

            if (params.tokenB != address(0)) {
                IERC20(params.tokenB).approve(address(_uniswap), amountIn);
            }

            _uniswap.execute{value: msg.value}(executeParams);
        } else if (params.route == Enums.TransactionRoute.Aave) {
            Params.RequiredSupply memory supplyParams = Params.RequiredSupply({
                payer: msg.sender,
                borrowAsset: params.token,
                borrowAmount: amountLeft,
                supplyAsset: params.tokenB,
                healthFactorMultiplier: params.healthFactorMultiplier
            });

            uint256 requiredSupplyMin = _aave.requiredSupplyMin(supplyParams);

            Params.ExecuteLoan memory executeParams = Params.ExecuteLoan({
                payer: msg.sender,
                supplyAsset: params.tokenB,
                requiredSupplyMin: requiredSupplyMin,
                borrowAsset: params.token,
                borrowAmount: amountLeft,
                signature: params.signature
            });

            if (params.tokenB != address(0)) {
                IERC20(params.tokenB).approve(
                    address(_aave),
                    requiredSupplyMin
                );
            }

            _aave.execute{value: msg.value}(executeParams);
        }

        _afterRoute(params.token, params.amount, params.wallet);
    }

    function _afterRoute(
        address token,
        uint256 amount,
        address spender
    ) internal {
        if (token != address(0)) {
            IERC20(token).approve(spender, amount);
        }
    }
}
