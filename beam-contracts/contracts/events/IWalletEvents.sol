// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IWalletEvents {
    event TransactionReceived(
        address indexed merchant,
        address token,
        address payer,
        uint256 amount,
        bytes32 transactionId
    );

    event WithdrawRequestCreated(
        address indexed merchant,
        uint256 indexed requestId,
        address token,
        uint256 amount,
        address recipient,
        address[] signers,
        bool executed
    );

    event WithdrawRequestApproved(
        address indexed merchant,
        uint256 indexed requestId,
        address signer
    );

    event WithdrawRequestExecuted(
        address indexed merchant,
        uint256 indexed requestId
    );

    event SignersUpdated(
        address indexed merchant,
        address[] signers,
        uint256 minSigners
    );

    event TokensUpdated(address indexed merchant, address[] tokens);

    function paymentReceived(
        address merchant,
        address token,
        address payer,
        uint256 amount,
        bytes32 transactionId
    ) external;

    function withdrawRequestCreated(
        address merchant,
        uint256 requestId,
        address token,
        uint256 amount,
        address recipient,
        address[] calldata signers,
        bool executed
    ) external;

    function withdrawRequestApproved(
        address merchant,
        uint256 requestId,
        address signer
    ) external;

    function withdrawRequestExecuted(
        address merchant,
        uint256 requestId
    ) external;

    function signersUpdated(
        address merchant,
        address[] calldata signers,
        uint256 minSigners
    ) external;

    function tokensUpdated(
        address merchant,
        address[] calldata tokens
    ) external;
}
