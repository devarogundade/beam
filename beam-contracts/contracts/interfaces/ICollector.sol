// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ICollector {
    function take(address token, uint256 amount) external;

    function takeETH() external payable;

    function currentFees() external view returns (uint256);

    function splitIntoAmountAndFees(
        uint256 totalAmount
    ) external view returns (uint256 amount, uint256 fees);
}
