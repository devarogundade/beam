// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";
import {IReceipt} from "../interfaces/IReceipt.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title Receipt
 * @dev A contract for minting receipt NFTs, based on the ERC721 standard.
 * @notice This contract allows the owner to mint receipts as non-fungible tokens (NFTs).
 */
contract Receipt is ERC721, IReceipt, Ownable {
    using Strings for uint256;

    string internal BASE_URL; // Base URL for the receipt metadata
    uint256 internal _lastTokenId; // Tracks the last issued token ID
    mapping(uint256 => string) internal _tokenURIs; // Mapping from token ID to metadata URI

    /**
     * @notice Constructor to initialize the contract with a base URI.
     * @param baseURI_ The base URI for receipt metadata.
     */
    constructor(
        string memory baseURI_
    ) ERC721("Beam Receipt", "BMRPT") Ownable(msg.sender) {
        BASE_URL = baseURI_;
    }

    /**
     * @notice Mints a new receipt NFT.
     * @param params The parameters for minting the receipt, including payer, token, amount, etc.
     * @dev Only the owner can mint receipts.
     */
    function mint(
        Params.MintReceipt memory params
    ) external override onlyOwner {
        _beforeNewReceipt();

        // Mint the receipt NFT
        _mint(params.to, _lastTokenId);

        // Set the token URI
        _tokenURIs[_lastTokenId] = _lastTokenId.toString();

        emit ReceiptMinted(params.to, _lastTokenId, params.transactionId);
    }

    /**
     * @notice Returns the metadata URI for a specific receipt.
     * @param tokenId The token ID of the receipt.
     * @return The URI for the receipt metadata.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @notice Returns the base URI for all receipts.
     * @return The base URI for the receipts.
     */
    function baseURI() public view override returns (string memory) {
        return _baseURI();
    }

    /**
     * @dev Internal function to return the base URI.
     * @return The base URI for the contract.
     */
    function _baseURI() internal view override returns (string memory) {
        return BASE_URL;
    }

    /**
     * @dev Internal function to increment the token ID for the next minted receipt.
     */
    function _beforeNewReceipt() internal {
        _lastTokenId = _lastTokenId + 1;
    }
}
