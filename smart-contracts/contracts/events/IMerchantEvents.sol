// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Types} from "../libs/Types.sol";

interface IMerchantEvents {
    event MerchantCreated(
        address indexed merchant,
        Types.Metadata metadata,
        address wallet,
        address[] tokens,
        address[] signers,
        uint256 minSigners
    );

    event MerchantMetadataUpdated(
        address indexed merchant,
        Types.Metadata metadata
    );

    event SubscriptionCreated(
        bytes32 indexed subsciptionId,
        address indexed merchant,
        uint256 interval,
        uint256 amount,
        uint256 gracePeriod,
        string description
    );

    event SubscriptionUpdated(
        bytes32 indexed subsciptionId,
        uint256 amount,
        uint256 gracePeriod,
        string description,
        bool active
    );

    event SubsciptionDeleted(bytes32 indexed subsciptionId);

    function merchantCreated(
        address merchant,
        Types.Metadata calldata metadata,
        address wallet,
        address[] calldata tokens,
        address[] calldata signers,
        uint256 minSigners
    ) external;

    function merchantUpdated(
        address merchant,
        Types.Metadata calldata metadata
    ) external;

    function subscriptionCreated(
        bytes32 subsciptionId,
        address merchant,
        uint256 interval,
        uint256 amount,
        uint256 gracePeriod,
        string calldata description
    ) external;

    function subscriptionUpdated(
        bytes32 subsciptionId,
        uint256 amount,
        uint256 gracePeriod,
        string calldata description,
        bool active
    ) external;

    function subscriptionDeleted(bytes32 subsciptionId) external;

    function grantWalletRole(address wallet) external;
}
