// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IOracle} from "../interfaces/IOracle.sol";
import {IChainlink} from "../interfaces/IChainlink.sol";

contract BeamOracle is IOracle {
    address internal immutable _usd;
    IChainlink internal immutable _chainlink;

    uint16 internal K = 1_000;

    constructor(address usd, IChainlink chainlink) {
        _usd = usd;
        _chainlink = chainlink;
    }

    function getAmountInUsd(
        address token,
        uint256 amountIn
    ) external view returns (uint256 amountInUsd) {
        (uint256 price, ) = _chainlink.getPrice(token);
        amountInUsd = (price * amountIn);
    }

    function getAmountFromUsd(
        address token,
        uint256 amountInUsd
    ) external view returns (uint256 amountOut) {
        (uint256 price, ) = _chainlink.getPrice(token);
        amountOut = (amountInUsd * K) / price;
    }
}
