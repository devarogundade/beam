// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";

interface IUniswap {
    function execute(Params.ExecuteSwap memory params) external payable;

    function requiredAmountIn(
        Params.RequiredAmountIn memory params
    ) external returns (uint256 amountIn);
}
