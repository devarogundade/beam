// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IOracle {
    function getAmountInUsd(
        address token,
        uint256 amountIn
    ) external view returns (uint256 amountInUsd);

    function getAmountFromUsd(
        address token,
        uint256 amountInUsd
    ) external view returns (uint256 amountOut);
}
