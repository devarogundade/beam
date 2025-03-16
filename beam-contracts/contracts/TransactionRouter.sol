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

    receive() external payable {}

    function _setAave(IAaveV3 aave) internal {
        _aave = aave;
    }

    function _setUniswap(IUniswap uniswap) internal {
        _uniswap = uniswap;
    }

    function _routeTransaction(Params.RouteTransaction memory params) internal {
        uint256 balance = 0;

        if (params.token == address(0)) {
            balance = payable(msg.sender).balance;
        } else {
            balance = IERC20(params.token).balanceOf(msg.sender);
        }

        // @dev Extract all amount from user
        if (balance >= params.amount) {
            if (params.token == address(0)) {
                require(msg.value >= params.amount, Errors.TRANSACTION_FAILED);
            } else {
                IERC20(params.token).transferFrom(
                    msg.sender,
                    address(this),
                    params.amount
                );
            }

            return _afterRoute(params.token, params.amount, params.wallet);
        }

        // @dev Extract all balance from user
        if (balance > 0) {
            if (params.token == address(0)) {
                require(msg.value == balance, Errors.INSUFFICIENT_BALANCE);
            } else {
                IERC20(params.token).transferFrom(
                    msg.sender,
                    address(this),
                    balance
                );
            }
        }

        uint256 amountLeft = params.amount - balance;

        if (params.route == Enums.TransactionRoute.Uniswap) {
            Params.RequiredAmountIn memory amountInParams = Params
                .RequiredAmountIn({
                    tokenIn: params.tokenB,
                    tokenOut: params.token,
                    amountOut: amountLeft,
                    slippage: params.slippage
                });

            uint256 amountInMax = _uniswap.requiredAmountIn(amountInParams);

            Params.ExecuteSwap memory executeParams = Params.ExecuteSwap({
                tokenIn: params.tokenB,
                tokenOut: params.token,
                amountInMax: amountInMax,
                amountOut: amountLeft
            });

            if (params.tokenB == address(0)) {
                _uniswap.execute{value: amountInMax}(executeParams);
            } else {
                IERC20(params.tokenB).transferFrom(
                    msg.sender,
                    address(this),
                    amountInMax
                );

                IERC20(params.tokenB).approve(address(_uniswap), amountInMax);

                _uniswap.execute(executeParams);
            }
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

            if (params.tokenB == address(0)) {
                _aave.execute{value: requiredSupplyMin}(executeParams);
            } else if (requiredSupplyMin > 0) {
                IERC20(params.tokenB).transferFrom(
                    msg.sender,
                    address(this),
                    requiredSupplyMin
                );

                IERC20(params.tokenB).approve(
                    address(_aave),
                    requiredSupplyMin
                );

                _aave.execute(executeParams);
            } else {
                _aave.execute(executeParams);
            }
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
