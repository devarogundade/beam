// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "../libs/Enums.sol";
import {Types} from "../libs/Types.sol";

import {IBeamEvents} from "./IBeamEvents.sol";
import {IHookEvents} from "./IHookEvents.sol";
import {IWalletEvents} from "./IWalletEvents.sol";
import {IMerchantEvents} from "./IMerchantEvents.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Events is
    AccessControl,
    IBeamEvents,
    IWalletEvents,
    IHookEvents,
    IMerchantEvents
{
    bytes32 public constant BEAM_ROLE = keccak256("BEAM_ROLE");
    bytes32 public constant WALLET_ROLE = keccak256("WALLET_ROLE");
    bytes32 public constant HOOK_ROLE = keccak256("HOOK_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");

    constructor(address CONTROLLER) {
        _grantRole(DEFAULT_ADMIN_ROLE, CONTROLLER);
    }

    function oneTimeTransactionCreated(
        bytes32 transactionId,
        address payer,
        address[] calldata payers,
        address merchant,
        address token,
        uint256[] calldata amounts,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        string calldata description,
        Types.Metadata calldata metadata,
        Enums.TransactionStatus status
    ) external override onlyRole(BEAM_ROLE) {
        emit OneTimeTransactionCreated(
            transactionId,
            payer,
            payers,
            merchant,
            token,
            amounts,
            adjustedToken,
            adjustedAmount,
            timestamp,
            description,
            metadata,
            status
        );
    }

    function oneTimeTransactionFulfilled(
        bytes32 transactionId,
        address payer,
        address merchant,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.TransactionStatus status
    ) external override onlyRole(BEAM_ROLE) {
        emit OneTimeTransactionFulfilled(
            transactionId,
            payer,
            merchant,
            token,
            amount,
            adjustedToken,
            adjustedAmount,
            timestamp,
            status
        );
    }

    function recurrentTransactionCreated(
        bytes32 transactionId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        string calldata description,
        Types.Metadata calldata metadata,
        Enums.TransactionStatus status
    ) external override onlyRole(BEAM_ROLE) {
        emit RecurrentTransactionCreated(
            transactionId,
            payer,
            merchant,
            dueDate,
            token,
            amount,
            adjustedToken,
            adjustedAmount,
            timestamp,
            description,
            metadata,
            status
        );
    }

    function recurrentTransactionFulfilled(
        bytes32 transactionId,
        address payer,
        address merchant,
        uint256 dueDate,
        address token,
        uint256 amount,
        address adjustedToken,
        uint256 adjustedAmount,
        uint256 timestamp,
        Enums.TransactionStatus status
    ) external override onlyRole(BEAM_ROLE) {
        emit RecurrentTransactionFulfilled(
            transactionId,
            payer,
            merchant,
            dueDate,
            token,
            amount,
            adjustedToken,
            adjustedAmount,
            timestamp,
            status
        );
    }

    function recurrentTransactionCancelled(
        bytes32 transactionId
    ) external override onlyRole(BEAM_ROLE) {
        emit RecurrentTransactionCancelled(transactionId);
    }

    function paymentReceived(
        address merchant,
        address token,
        address payer,
        uint256 amount,
        bytes32 transactionId
    ) external override onlyRole(WALLET_ROLE) {
        emit TransactionReceived(merchant, token, payer, amount, transactionId);
    }

    function withdrawRequestCreated(
        address merchant,
        uint256 requestId,
        address token,
        uint256 amount,
        address recipient,
        address[] calldata signers,
        bool executed
    ) external override onlyRole(WALLET_ROLE) {
        emit WithdrawRequestCreated(
            merchant,
            requestId,
            token,
            amount,
            recipient,
            signers,
            executed
        );
    }

    function withdrawRequestApproved(
        address merchant,
        uint256 requestId,
        address signer
    ) external override onlyRole(WALLET_ROLE) {
        emit WithdrawRequestApproved(merchant, requestId, signer);
    }

    function withdrawRequestExecuted(
        address merchant,
        uint256 requestId
    ) external override onlyRole(WALLET_ROLE) {
        emit WithdrawRequestExecuted(merchant, requestId);
    }

    function signersUpdated(
        address merchant,
        address[] calldata signers,
        uint256 minSigners
    ) external override onlyRole(WALLET_ROLE) {
        emit SignersUpdated(merchant, signers, minSigners);
    }

    function tokensUpdated(
        address merchant,
        address[] calldata tokens
    ) external override onlyRole(WALLET_ROLE) {
        emit TokensUpdated(merchant, tokens);
    }

    function merchantCreated(
        address merchant,
        Types.Metadata calldata metadata,
        address wallet,
        address[] calldata tokens,
        address[] calldata signers,
        uint256 minSigners
    ) external override onlyRole(MERCHANT_ROLE) {
        emit MerchantCreated(
            merchant,
            metadata,
            wallet,
            tokens,
            signers,
            minSigners
        );
    }

    function merchantUpdated(
        address merchant,
        Types.Metadata calldata metadata
    ) external override onlyRole(MERCHANT_ROLE) {
        emit MerchantMetadataUpdated(merchant, metadata);
    }

    function subscriptionCreated(
        bytes32 subsciptionId,
        address merchant,
        uint256 interval,
        uint256 amount,
        uint256 gracePeriod,
        string calldata description
    ) external override onlyRole(MERCHANT_ROLE) {
        emit SubscriptionCreated(
            subsciptionId,
            merchant,
            interval,
            amount,
            gracePeriod,
            description
        );
    }

    function subscriptionUpdated(
        bytes32 subsciptionId,
        uint256 amount,
        uint256 gracePeriod,
        string calldata description,
        bool active
    ) external override onlyRole(MERCHANT_ROLE) {
        emit SubscriptionUpdated(
            subsciptionId,
            amount,
            gracePeriod,
            description,
            active
        );
    }

    function subscriptionDeleted(
        bytes32 subsciptionId
    ) external override onlyRole(MERCHANT_ROLE) {
        emit SubsciptionDeleted(subsciptionId);
    }

    function grantWalletRole(
        address wallet
    ) external override onlyRole(MERCHANT_ROLE) {
        _grantRole(WALLET_ROLE, wallet);
    }

    function hookRegistered(
        address merchant,
        address hook
    ) external override onlyRole(HOOK_ROLE) {
        emit HookRegistered(merchant, hook);
    }

    function hookUnRegistered(
        address merchant,
        address hook
    ) external override onlyRole(HOOK_ROLE) {
        emit HookUnRegistered(merchant, hook);
    }

    function grantRole(
        address account,
        bytes32 role
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, account);
    }

    function revokeMinterRole(
        address account,
        bytes32 role
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(role, account);
    }
}
