// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";

interface IAaveV3 {
    function execute(Params.ExecuteLoan memory params) external payable;

    function getVariableDebtTokenAddresses(
        address asset
    ) external view returns (address variableDebtToken);

    function requiredSupplyMin(
        Params.RequiredSupply memory params
    ) external view returns (uint256 additionalCollateral);
}
