// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Types} from "./libs/Types.sol";
import {Errors} from "./libs/Errors.sol";
import {IWallet} from "./interfaces/IWallet.sol";
import {IWalletEvents} from "./events/IWalletEvents.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MultiSigWallet is Ownable, IWallet {
    IWalletEvents internal _events;

    address[] internal _tokens;
    address[] internal _signers;
    uint256 internal _minSigners;

    uint256 internal _lastRequestId;
    mapping(uint256 => Types.WithdrawRequest) internal _requests;

    modifier onlySigner() {
        require(isSigner(msg.sender), Errors.UNAUTHORIZED);
        _;
    }

    constructor(
        IWalletEvents events_,
        address merchant_,
        address[] memory tokens_,
        address[] memory signers_,
        uint256 minSigners_
    ) payable Ownable(merchant_) {
        require(_minSigners > 0, Errors.MIN_SIGNER_MUST_BE_GRT_ONE);
        require(_minSigners <= _signers.length, Errors.OPERATION_FAILED);

        _events = events_;
        _tokens = tokens_;
        _signers = signers_;
        _minSigners = minSigners_;
    }

    function deposit(
        address token,
        uint256 amount,
        bytes32 paymentId
    ) external payable override {
        require(isTokenAllowed(token), Errors.TOKEN_NOT_SUPPORTED);
        require(amount > 0, Errors.INVALID_INPUT);

        if (token == address(0)) {
            require(amount == msg.value, Errors.INVALID_INPUT);
        } else {
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }

        _events.paymentReceived(owner(), token, msg.sender, amount, paymentId);
    }

    function requestWithdraw(
        address token,
        uint256 amount,
        address recipient
    ) external onlyOwner {
        require(recipient != address(0), Errors.INVALID_INPUT);

        _lastRequestId = _lastRequestId + 1;

        Types.WithdrawRequest storage newRequest = _requests[_lastRequestId];
        newRequest.token = token;
        newRequest.amount = amount;
        newRequest.recipient = recipient;
        newRequest.executed = false;

        _events.withdrawRequestCreated(
            owner(),
            _lastRequestId,
            token,
            amount,
            recipient,
            new address[](0),
            false
        );
    }

    function approveWithdraw(uint256 requestId) external override onlySigner {
        Types.WithdrawRequest storage request = _requests[requestId];

        require(!request.executed, Errors.ACTION_NOT_ALLOWED);
        require(!request.hasApproved[msg.sender], Errors.ACTION_NOT_ALLOWED);

        request.hasApproved[msg.sender] = true;
        request.approvals++;

        _events.withdrawRequestApproved(owner(), requestId, msg.sender);
    }

    function executeWithdraw(uint256 requestId) external override {
        Types.WithdrawRequest storage request = _requests[requestId];

        require(
            request.approvals >= _minSigners,
            Errors.INSUFFICIENT_APPROVALS
        );
        require(!request.executed, Errors.ACTION_NOT_ALLOWED);

        if (request.token == address(0)) {
            require(
                address(this).balance >= request.amount,
                Errors.INSUFFICIENT_BALANCE
            );
            payable(request.recipient).transfer(request.amount);
        } else {
            IERC20 erc20 = IERC20(request.token);
            require(
                erc20.balanceOf(address(this)) >= request.amount,
                Errors.INSUFFICIENT_BALANCE
            );
            erc20.transfer(request.recipient, request.amount);
        }

        request.executed = true;

        _events.withdrawRequestExecuted(owner(), requestId);
    }

    function isTokenAllowed(address token) public view override returns (bool) {
        for (uint256 index = 0; index < _tokens.length; index++) {
            if (_tokens[index] == token) return true;
        }
        return false;
    }

    function isSigner(address account) public view returns (bool) {
        for (uint256 i = 0; i < _signers.length; i++) {
            if (_signers[i] == account) {
                return true;
            }
        }
        return false;
    }

    function getSigners() external view returns (address[] memory) {
        return _signers;
    }

    function updateTokens(address[] memory tokens) external override onlyOwner {
        require(_tokens.length > 0, Errors.INVALID_INPUT);

        _tokens = tokens;

        _events.tokensUpdated(msg.sender, tokens);
    }

    function updateSigners(
        address[] memory signers,
        uint256 minSigners
    ) external override onlyOwner {
        require(minSigners > 0, Errors.MIN_SIGNER_MUST_BE_GRT_ONE);
        require(minSigners <= signers.length, Errors.OPERATION_FAILED);

        _signers = signers;
        _minSigners = minSigners;

        _events.signersUpdated(msg.sender, signers, minSigners);
    }
}
