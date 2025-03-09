// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";

interface IReceipt {
    /**
     * @dev Emitted when a new receipt is minted.
     * @param to The Receiver receiver.
     * @param tokenId The ID of the minted receipt token.
     * @param transactionId The ID of the payment.
     */
    event ReceiptMinted(
        address indexed to,
        uint256 tokenId,
        bytes32 transactionId
    );

    function mint(Params.MintReceipt memory params) external;

    function baseURI() external view returns (string memory);
}
