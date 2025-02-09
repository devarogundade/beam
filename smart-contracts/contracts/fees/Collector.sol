// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Errors} from "../libs/Errors.sol";
import {AddressLib} from "../libs/AddressLib.sol";

import {ICollector} from "../interfaces/ICollector.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Collector is ICollector, Ownable {
    uint256 internal _currentFees;
    uint256 internal constant _denominator = 10_000;

    constructor(uint256 fees_) Ownable(msg.sender) {
        require(fees_ >= _denominator, Errors.INVALID_INPUT);

        _currentFees = fees_;
    }

    function take(address token, uint256 amount) external override {
        if (amount == 0) return;
        AddressLib.requireOne(token);
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }

    function takeETH() external payable override {}

    function withdraw(
        address token,
        uint256 amount,
        address recipient
    ) external onlyOwner {
        AddressLib.requireOne(recipient);
        IERC20(token).transfer(recipient, amount);
    }

    function withdrawETH(uint256 amount, address recipient) external onlyOwner {
        AddressLib.requireOne(recipient);

        payable(recipient).transfer(amount);
    }

    function updateFees(uint256 fees) external onlyOwner {
        require(fees >= _denominator, Errors.INVALID_INPUT);

        _currentFees = fees;
    }

    function currentFees() external view override returns (uint256) {
        return _currentFees;
    }

    function splitIntoAmountAndFees(
        uint256 totalAmount
    ) external view override returns (uint256 amount, uint256 fees) {
        fees = (totalAmount * _currentFees) / _denominator;
        amount = totalAmount - fees;
    }
}
