// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";
import {Errors} from "../libs/Errors.sol";
import {IAaveV3} from "../interfaces/IAaveV3.sol";

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IPriceOracle} from "@aave/core-v3/contracts/interfaces/IPriceOracle.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {ReserveConfiguration} from "@aave/core-v3/contracts/protocol/libraries/configuration/ReserveConfiguration.sol";
import {VariableDebtToken} from "@aave/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol";
import {IWrappedTokenGatewayV3} from "../interfaces/IWrappedTokenGatewayV3.sol";

contract AaveV3 is IAaveV3 {
    address internal _wethGateway;
    address internal _poolAddressesProvider;

    address internal constant WETH = 0xb123dCe044EdF0a755505d9623Fba16C0F41cae9;

    constructor(address wethGateway_, address poolAddressesProvider_) {
        _wethGateway = wethGateway_;
        _poolAddressesProvider = poolAddressesProvider_;
    }

    function execute(
        Params.ExecuteLoan memory params
    ) external payable override {
        IPoolAddressesProvider provider = IPoolAddressesProvider(
            _poolAddressesProvider
        );

        IPool pool = IPool(provider.getPool());
        IWrappedTokenGatewayV3 wethGateway = IWrappedTokenGatewayV3(
            _wethGateway
        );

        if (params.requiredSupplyMin == 0) {
            // @dev supplying collateral not required
        } else if (params.supplyAsset == address(0)) {
            require(
                msg.value >= params.requiredSupplyMin,
                Errors.INVALID_INPUT
            );

            wethGateway.depositETH{value: params.requiredSupplyMin}(
                address(pool),
                params.payer,
                0
            );
        } else {
            IERC20 erc20 = IERC20(params.supplyAsset);
            erc20.transferFrom(
                msg.sender,
                address(this),
                params.requiredSupplyMin
            );
            erc20.approve(address(pool), params.requiredSupplyMin);

            pool.supply(
                params.supplyAsset,
                params.requiredSupplyMin,
                params.payer,
                0
            );
        }

        address variableDebtToken = getVariableDebtTokenAddresses(
            params.borrowAsset
        );

        VariableDebtToken(variableDebtToken).delegationWithSig(
            params.payer,
            address(this),
            params.borrowAmount,
            params.signature.deadline,
            params.signature.v,
            params.signature.r,
            params.signature.s
        );

        pool.borrow(
            params.borrowAsset,
            params.borrowAmount,
            2,
            0,
            params.payer
        );

        if (params.borrowAsset == address(0)) {
            payable(msg.sender).transfer(params.borrowAmount);
        } else {
            IERC20(params.borrowAsset).transfer(
                msg.sender,
                params.borrowAmount
            );
        }
    }

    function getVariableDebtTokenAddresses(
        address asset
    ) public view override returns (address variableDebtToken) {
        IPoolAddressesProvider provider = IPoolAddressesProvider(
            _poolAddressesProvider
        );

        IPool pool = IPool(provider.getPool());

        DataTypes.ReserveData memory reserveData = pool.getReserveData(asset);

        variableDebtToken = reserveData.variableDebtTokenAddress;
    }

    function requiredSupplyMin(
        Params.RequiredSupply memory params
    ) public view override returns (uint256 additionalCollateral) {
        if (params.supplyAsset == address(0)) {
            params.supplyAsset = WETH;
        }

        IPoolAddressesProvider provider = IPoolAddressesProvider(
            _poolAddressesProvider
        );

        IPool pool = IPool(provider.getPool());
        IPriceOracle priceOracle = IPriceOracle(provider.getPriceOracle());

        (, , uint256 availableBorrowsBase, , , uint256 healthFactor) = pool
            .getUserAccountData(params.payer);

        require(healthFactor > 0, Errors.LOAN_REJECTION);
        require(params.healthFactorMultiplier > 100, Errors.LOAN_REJECTION);

        uint256 borrowAssetPriceInETH = priceOracle.getAssetPrice(
            params.borrowAsset
        );
        uint256 supplyAssetPriceInETH = priceOracle.getAssetPrice(
            params.supplyAsset
        );

        DataTypes.ReserveData memory reserveData = pool.getReserveData(
            params.supplyAsset
        );

        uint256 ltv = ReserveConfiguration.getLtv(reserveData.configuration);

        uint256 ltvPercentage = ltv / 100;

        uint8 borrowDecimals = IERC20Metadata(params.borrowAsset).decimals();

        uint256 borrowAmountInETH = (params.borrowAmount *
            borrowAssetPriceInETH) / (10 ** borrowDecimals);

        if (borrowAmountInETH <= availableBorrowsBase) {
            return 0;
        }

        uint256 additionalCollateralETH = ((borrowAmountInETH -
            availableBorrowsBase) * 100) / ltvPercentage;

        uint8 supplyDecimals = IERC20Metadata(params.supplyAsset).decimals();

        additionalCollateral =
            (additionalCollateralETH * (10 ** supplyDecimals)) /
            supplyAssetPriceInETH;

        additionalCollateral =
            (additionalCollateral * params.healthFactorMultiplier) /
            100;
    }
}
