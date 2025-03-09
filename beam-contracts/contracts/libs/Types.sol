// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Enums} from "./Enums.sol";

library Types {
    struct Metadata {
        uint8 schemaVersion;
        string value;
    }

    struct MerchantConfig {
        Metadata metadata;
        address wallet;
    }

    struct OneTimeTransaction {
        address payer;
        address[] payers;
        address merchant;
        uint256[] amounts;
        bool[] fulfillments;
        address token;
        uint256[] timestamps;
        string description;
        Metadata metadata;
        Enums.TransactionStatus status;
    }

    struct Subscription {
        address token;
        uint256 interval;
        uint256 amount;
        uint256 gracePeriod;
        string description;
        address merchant;
        bool active;
    }

    struct RecurrentTransaction {
        address payer;
        address merchant;
        bytes32 subscriptionId;
        string description;
        uint256[] timestamps;
        uint256[] amounts;
        uint256 dueDate;
        Metadata metadata;
        Enums.TransactionStatus status;
    }

    struct WithdrawRequest {
        address token;
        uint256 amount;
        address recipient;
        uint256 approvals;
        mapping(address => bool) hasApproved;
        bool executed;
    }

    struct HookConfig {
        bool onBeforePayment;
        bool onAfterPayment;
        bool onAdjustTokenAmount;
    }
}
