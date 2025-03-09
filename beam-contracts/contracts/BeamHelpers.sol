// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "./libs/Params.sol";

import {IMerchant} from "./interfaces/IMerchant.sol";
import {IHookManager} from "./interfaces/IHookManager.sol";

abstract contract BeamHelpers {
    IMerchant internal _merchant;
    IHookManager internal _hookManager;

    constructor(IMerchant merchant_, IHookManager hookManager_) {
        _merchant = merchant_;
        _hookManager = hookManager_;
    }

    function getAdjustTokenAmount(
        Params.AdjustTokenAmount memory params
    ) external view returns (address adjustedToken, uint256 adjustedAmount) {
        return _hookManager.adjustTokenAmount(params);
    }
}
