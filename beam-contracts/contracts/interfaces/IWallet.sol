// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IWallet {
    function updateTokens(address[] memory tokens) external;

    function updateSigners(
        address[] memory signers,
        uint256 minSigners
    ) external;

    function deposit(address token, uint256 amount) external payable;

    function approveWithdraw(uint256 requestId) external;

    function executeWithdraw(uint256 requestId) external;

    function isTokenAllowed(address token) external view returns (bool);
}
