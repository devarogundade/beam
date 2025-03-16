// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";
import {Errors} from "../libs/Errors.sol";
import {IUniswap} from "../interfaces/IUniswap.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
contract UniswapV2 is IUniswap {
    IUniswapV2Router02 internal immutable _swapRouter;

    constructor(address router_) {
        _swapRouter = IUniswapV2Router02(router_);
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
    ) external view override returns (uint256 amountIn) {
        address[] memory path = new address[](2);

        path[0] = params.tokenIn == address(0)
            ? _swapRouter.WETH()
            : params.tokenIn;

        path[1] = params.tokenOut == address(0)
            ? _swapRouter.WETH()
            : params.tokenOut;

        uint256[] memory amounts = _swapRouter.getAmountsIn(
            params.amountOut,
            path
        );

        uint256 slippageAmount = (amounts[0] * params.slippage) / 100;

        amountIn = amounts[0] + slippageAmount;
    }

    function _swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountInMax,
        uint256 amountOut
    ) internal {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);
        IERC20(tokenIn).approve(address(_swapRouter), amountInMax);

        address[] memory path = new address[](2);

        path[0] = tokenIn;
        path[1] = tokenOut;

        _swapRouter.swapTokensForExactTokens(
            amountOut,
            amountInMax,
            path,
            msg.sender,
            block.timestamp + 1
        );
    }

    function _swapEthToToken(address tokenOut, uint256 amountOut) internal {
        require(msg.value > 0, Errors.INVALID_INPUT);

        address[] memory path = new address[](2);

        path[0] = _swapRouter.WETH();
        path[1] = tokenOut;

        _swapRouter.swapETHForExactTokens{value: msg.value}(
            amountOut,
            path,
            msg.sender,
            block.timestamp + 1
        );
    }

    function _swapTokenToEth(
        address tokenIn,
        uint256 amountInMax,
        uint256 amountOut
    ) internal {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);
        IERC20(tokenIn).approve(address(_swapRouter), amountInMax);

        address[] memory path = new address[](2);

        path[0] = tokenIn;
        path[1] = _swapRouter.WETH();

        _swapRouter.swapTokensForExactETH(
            amountOut,
            amountInMax,
            path,
            msg.sender,
            block.timestamp + 1
        );
    }
}
