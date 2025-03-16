// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";

interface IAaveV3 {
    function execute(Params.ExecuteLoan memory params) external payable;

    function getHealthFactor(address payer) external view returns (uint256 hf);

    function getCurrentVariableBorrowRate(
        address borrowAsset
    ) external returns (uint256 rate);

    function getCurrentLiquidityRate(
        address supplyAsset
    ) external view returns (uint256 rate);

    function getVariableDebtTokenAddresses(
        address asset
    ) external view returns (address variableDebtToken);

    function requiredSupplyMin(
        Params.RequiredSupply memory params
    ) external view returns (uint256 additionalCollateral);
}
