// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Types} from "../libs/Types.sol";
import {Enums} from "../libs/Enums.sol";

library Params {
    struct CreateMerchant {
        Types.Metadata metadata;
        address[] tokens;
        address[] signers;
        uint256 minSigners;
    }

    struct UpdateMerchant {
        Types.Metadata metadata;
    }

    struct RegisterHook {
        address hook;
    }

    struct CreateOneTimeTransaction {
        address[] payers;
        address merchant;
        uint256[] amounts;
        address token;
        address tokenB;
        string description;
        Types.Metadata metadata;
        bool mintReceipt;
        uint256 healthFactorMultiplier;
        Enums.TransactionRoute route;
        Signature signature;
    }

    struct FulfillOneTimeTransaction {
        bytes32 transactionId;
        address tokenB;
        bool mintReceipt;
        uint256 healthFactorMultiplier;
        Enums.TransactionRoute route;
        Signature signature;
    }

    struct CreateSubscription {
        address token;
        uint256 interval;
        uint256 amount;
        uint256 gracePeriod;
        string description;
    }

    struct UpdateSubscription {
        bytes32 subscriptionId;
        uint256 amount;
        uint256 gracePeriod;
        string description;
        bool active;
    }

    struct DeleteSubscription {
        bytes32 subscriptionId;
    }

    struct CreateRecurrentTransaction {
        address merchant;
        address tokenB;
        bytes32 subscriptionId;
        string description;
        Types.Metadata metadata;
        bool mintReceipt;
        uint256 healthFactorMultiplier;
        Enums.TransactionRoute route;
        Signature signature;
    }

    struct FulfillRecurrentTransaction {
        bytes32 transactionId;
        address tokenB;
        bool mintReceipt;
        uint256 healthFactorMultiplier;
        Enums.TransactionRoute route;
        Signature signature;
    }

    struct CancelRecurrentTransaction {
        bytes32 transactionId;
    }

    struct ExecuteSwap {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
    }

    struct RequiredAmountIn {
        address tokenIn;
        address tokenOut;
        uint256 amountOut;
    }

    struct ExecuteLoan {
        address payer;
        address supplyAsset;
        uint256 requiredSupplyMin;
        address borrowAsset;
        uint256 borrowAmount;
        Signature signature;
    }

    struct RequiredSupply {
        address payer;
        address borrowAsset;
        uint256 borrowAmount;
        address supplyAsset;
        uint256 healthFactorMultiplier;
    }

    struct RoutePayment {
        address token;
        address tokenB;
        uint256 amount;
        address wallet;
        uint256 healthFactorMultiplier;
        Enums.TransactionRoute route;
        Signature signature;
    }

    struct MintReceipt {
        address to;
        bytes32 transactionId;
    }

    struct Signature {
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct BeforePayment {
        address merchant;
        address payer;
        address token;
        uint256 amount;
    }

    struct AfterPayment {
        address merchant;
        bytes32 transactionId;
        address payer;
        address token;
        uint256 amount;
        address adjustedToken;
        uint256 adjustedAmount;
    }

    struct AdjustTokenAmount {
        address merchant;
        address payer;
        address token;
        uint256 amount;
    }
}
