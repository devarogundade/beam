// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {BaseHook} from "../BaseHook.sol";
import {Types} from "../../libs/Types.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FiatHook is BaseHook, Ownable {
    address internal _usdt;
    address internal _fiatToken;
    uint256 internal _priceInUSD;

    uint256 internal constant _denominator = 100;

    constructor(
        address usdt_,
        address fiatToken_,
        uint256 pricesInUSD_
    ) Ownable(msg.sender) {
        _usdt = usdt_;
        _fiatToken = fiatToken_;
        _priceInUSD = pricesInUSD_;
    }

    function updatePriceInUSD(uint256 priceInUSD) external onlyOwner {
        _priceInUSD = priceInUSD;
    }

    function _onRegister()
        internal
        pure
        override
        returns (Types.HookConfig memory hookConfig)
    {
        hookConfig.onAdjustTokenAmount = true;
    }

    function _onAdjustTokenAmount(
        address,
        address token,
        uint256 amount
    )
        internal
        view
        override
        returns (address adjustedToken, uint256 adjustedAmount)
    {
        if (token != _fiatToken) {
            adjustedToken = token;
            adjustedAmount = amount;
        } else {
            adjustedToken = _usdt;
            adjustedAmount = (amount * _denominator) / _priceInUSD;
        }
    }
}
