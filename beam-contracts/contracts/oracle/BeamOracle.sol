// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IOracle} from "../interfaces/IOracle.sol";
import {IChainlink} from "../interfaces/IChainlink.sol";

contract BeamOracle is IOracle {
    address internal immutable _usd;
    IChainlink internal immutable _chainlink;

    constructor(address usd, IChainlink chainlink) {
        _usd = usd;
        _chainlink = chainlink;
    }

    function getAmountInUsd(
        address token,
        uint256 amountIn
    ) external view returns (uint256 amountInUsd) {
        (uint256 basePrice, ) = _chainlink.getPrice(token);
        (uint256 quotePrice, ) = _chainlink.getPrice(_usd);

        return (basePrice * amountIn) / quotePrice;
    }

    function getAmountFromUsd(
        address token,
        uint256 amountInUsd
    ) external view returns (uint256 amountOut) {
        (uint256 basePrice, ) = _chainlink.getPrice(_usd);
        (uint256 quotePrice, ) = _chainlink.getPrice(token);

        return (basePrice * amountInUsd) / quotePrice;
    }
}
