// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Types} from "../libs/Types.sol";
import {Params} from "../libs/Params.sol";

interface IMerchant {
    function create(Params.CreateMerchant memory params) external payable;

    function update(Params.UpdateMerchant memory params) external;

    function createSubscription(
        Params.CreateSubscription memory params
    ) external returns (bytes32 subscriptionId);

    function updateSubscription(
        Params.UpdateSubscription memory params
    ) external;

    function deleteSubscription(
        Params.DeleteSubscription memory params
    ) external;

    function getWallet(address merchant) external view returns (address);

    function getSubscription(
        bytes32 subscriptionId
    ) external view returns (Types.Subscription memory);

    function getMerchant(
        address merchant
    ) external view returns (Types.MerchantConfig memory);
}
