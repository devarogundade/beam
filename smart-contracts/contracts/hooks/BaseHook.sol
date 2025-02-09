// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Errors} from "../libs/Errors.sol";
import {Types} from "../libs/Types.sol";
import {IHook} from "../interfaces/IHook.sol";

abstract contract BaseHook is IHook {
    address private _manager;
    bool internal _registered = false;

    function onRegister()
        external
        virtual
        override
        returns (Types.HookConfig memory hookConfig)
    {
        require(!_registered, Errors.HOOK_ALREADY_REGISTERED);

        _manager = msg.sender;
        _registered = true;

        return _onRegister();
    }

    function _onRegister()
        internal
        virtual
        returns (Types.HookConfig memory hookConfig)
    {}

    function onUnRegister() external virtual override onlyManager {
        _manager = address(0);
        _registered = false;
    }

    function onBeforePayment(
        address payer,
        address token,
        uint256 amount
    ) external virtual override onlyManager {
        return _onBeforePayment(payer, token, amount);
    }

    function _onBeforePayment(
        address payer,
        address token,
        uint256 amount
    ) internal virtual {}

    function onAfterPayment(
        bytes32 paymentId,
        address payer,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount
    ) external virtual override onlyManager {
        _onAfterPayment(
            paymentId,
            payer,
            token,
            amount,
            adjustedToken,
            adjustedAmount
        );
    }

    function _onAfterPayment(
        bytes32 paymentId,
        address payer,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount
    ) internal virtual {}

    function onAdjustTokenAmount(
        address payer,
        address token,
        uint256 amount
    )
        external
        view
        override
        onlyManager
        returns (address adjustedToken, uint256 adjustedAmount)
    {
        return _onAdjustTokenAmount(payer, token, amount);
    }

    function _onAdjustTokenAmount(
        address payer,
        address token,
        uint256 amount
    )
        internal
        view
        virtual
        returns (address adjustedToken, uint256 adjustedAmount)
    {}

    modifier onlyManager() {
        require(msg.sender == _manager, Errors.UNAUTHORIZED);
        _;
    }
}
