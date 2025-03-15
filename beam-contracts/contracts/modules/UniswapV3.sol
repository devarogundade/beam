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

    receive() external payable {}

    function execute(
        Params.ExecuteSwap memory params
    ) external payable override {
        if (params.tokenIn == params.tokenOut) {
            return;
        } else if (params.tokenIn == address(0)) {
            _swapEthToToken(params.tokenOut, params.amountOut);
        } else if (params.tokenOut == address(0)) {
            _swapTokenToEth(
                params.tokenIn,
                params.amountInMax,
                params.amountOut
            );
        } else {
            _swapTokens(
                params.tokenIn,
                params.tokenOut,
                params.amountInMax,
                params.amountOut
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

        uint256 slippageAmount = (amountIn * params.slippage) / 100;

        amountIn = amountIn + slippageAmount;
    }

    function _swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountInMax,
        uint256 amountOut
    ) internal {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);
        IERC20(tokenIn).approve(address(_swapRouter), amountInMax);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: 0,
                recipient: msg.sender,
                deadline: block.timestamp + 1,
                amountOut: amountOut,
                amountInMaximum: amountInMax,
                sqrtPriceLimitX96: 0
            });

        _swapRouter.exactOutputSingle(params);
    }

    function _swapEthToToken(address tokenOut, uint256 amountOut) internal {
        require(msg.value > 0, Errors.INVALID_INPUT);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: WETH,
                tokenOut: tokenOut,
                fee: 0,
                recipient: msg.sender,
                deadline: block.timestamp + 1,
                amountOut: amountOut,
                amountInMaximum: msg.value,
                sqrtPriceLimitX96: 0
            });

        _swapRouter.exactOutputSingle{value: msg.value}(params);
    }

    function _swapTokenToEth(
        address tokenIn,
        uint256 amountInMax,
        uint256 amountOut
    ) internal {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);
        IERC20(tokenIn).approve(address(_swapRouter), amountInMax);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: WETH,
                fee: 0,
                recipient: msg.sender,
                deadline: block.timestamp + 1,
                amountOut: amountOut,
                amountInMaximum: amountInMax,
                sqrtPriceLimitX96: 0
            });

        _swapRouter.exactOutputSingle(params);
    }
}
