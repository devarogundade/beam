// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IChainlink} from "../interfaces/IChainlink.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Chainlink is IChainlink, Ownable {
    mapping(address => address) _feeds;

    constructor() Ownable(msg.sender) {}

    function setFeed(address token, address feed) external onlyOwner {
        _feeds[token] = feed;
    }

    function getPrice(
        address token
    ) external view override returns (uint256, uint80) {
        AggregatorV3Interface agg = AggregatorV3Interface(_feeds[token]);

        (, int256 answer, , , uint80 decimal) = agg.latestRoundData();

        return (uint(answer), decimal);
    }
}
