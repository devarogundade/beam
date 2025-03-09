// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";
import {Errors} from "../libs/Errors.sol";
import {IUniswap} from "../interfaces/IUniswap.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IQuoter} from "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract UniswapV3 is IUniswap {
    ISwapRouter internal immutable _swapRouter;
    IQuoter internal immutable _quoter;

    address internal constant WETH = 0xb123dCe044EdF0a755505d9623Fba16C0F41cae9;

    constructor(address router_, address quoter_) {
        _swapRouter = ISwapRouter(router_);
        _quoter = IQuoter(quoter_);
    }

    function execute(
        Params.ExecuteSwap memory params
    ) external payable override {
        if (params.tokenIn == params.tokenOut) {
            return;
        } else if (params.tokenIn == address(0)) {
            _swapEthToToken(params.tokenOut, params.amountOutMin);
        } else if (params.tokenOut == address(0)) {
            _swapTokenToEth(
                params.tokenIn,
                params.amountIn,
                params.amountOutMin
            );
        } else {
            _swapTokens(
                params.tokenIn,
                params.tokenOut,
                params.amountIn,
                params.amountOutMin
            );
        }
    }

    function requiredAmountIn(
        Params.RequiredAmountIn memory params
    ) external override returns (uint256 amountIn) {
        if (params.tokenIn == address(0)) {
            params.tokenIn = WETH;
        }

        if (params.tokenOut == address(0)) {
            params.tokenOut = WETH;
        }

        amountIn = _quoter.quoteExactOutputSingle(
            params.tokenIn,
            params.tokenOut,
            0,
            params.amountOut,
            0
        );
    }

    function _swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) internal {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(_swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: 0,
                recipient: msg.sender,
                deadline: block.timestamp + 1,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        _swapRouter.exactInputSingle(params);
    }

    function _swapEthToToken(address tokenOut, uint256 amountOutMin) internal {
        require(msg.value > 0, Errors.INVALID_INPUT);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: tokenOut,
                fee: 0,
                recipient: msg.sender,
                deadline: block.timestamp + 1,
                amountIn: msg.value,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        _swapRouter.exactInputSingle{value: msg.value}(params);
    }

    function _swapTokenToEth(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin
    ) internal {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(_swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: WETH,
                fee: 0,
                recipient: msg.sender,
                deadline: block.timestamp + 1,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        _swapRouter.exactInputSingle(params);
    }
}
