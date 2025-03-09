// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

library Errors {
    // Generic Errors
    string public constant TEST = "1";
    string public constant UNAUTHORIZED = "2";
    string public constant INVALID_INPUT = "3";
    string public constant ACTION_NOT_ALLOWED = "4";
    string public constant INSUFFICIENT_BALANCE = "5";
    string public constant OPERATION_FAILED = "6";

    // Transaction Errors
    string public constant TRANSACTION_FAILED = "100";
    string public constant INVALID_TRANSACTION_AMOUNT = "101";
    string public constant TOKEN_NOT_SUPPORTED = "102";
    string public constant TRANSACTION_NOT_ACTIVE = "103";
    string public constant TRANSACTION_INVALID_PAYER = "104";
    string public constant TRANSACTION_NOT_PENDING = "105";

    // Subscription Errors
    string public constant SUBSCRIPTION_NOT_FOUND = "200";
    string public constant SUBSCRIPTION_INACTIVE = "201";
    string public constant GRACE_PERIOD_EXPIRED = "202";

    // Recurrent Payment Errors
    string public constant TRANSACTION_ID_NOT_FOUND = "300";
    string public constant TRANSACTION_ALREADY_COMPLETED = "301";
    string public constant RECURRING_TRANSACTION_EXPIRED = "302";

    // Swap and Loan Errors
    string public constant INVALID_SWAP_PARAMETERS = "400";
    string public constant INSUFFICIENT_LIQUIDITY = "401";
    string public constant LOAN_NOT_FOUND = "402";
    string public constant LOAN_REJECTION = "403";

    // Merchant Errors
    string public constant MERCHANT_ALREADY_EXIST = "404";
    string public constant MERCHANT_NOT_FOUND = "405";

    // Internal Errors
    string public constant INTERNAL_ERROR = "500";
    string public constant STORAGE_ERROR = "501";

    // Signature Errors
    string public constant INVALID_SIGNATURE = "600";
    string public constant SIGNATURE_EXPIRED = "601";

    // Hook Errors
    string public constant HOOK_ALREADY_REGISTERED = "700";
    string public constant HOOK_NOT_FOUND = "701";

    // Wallet Errors
    string public constant MIN_SIGNER_MUST_BE_GRT_ONE = "800";
    string public constant INSUFFICIENT_APPROVALS = "801";
}
