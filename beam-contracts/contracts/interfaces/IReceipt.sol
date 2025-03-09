// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";

interface IReceipt {
    function mint(Params.MintReceipt memory params) external;

    function baseURI() external view returns (string memory);
}
