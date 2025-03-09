// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IChainlink {
    function getPrice(
        address token
    ) external view returns (uint256 price, uint80 decimal);
}
