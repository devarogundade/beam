// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Params} from "../libs/Params.sol";
import {IReceipt} from "../interfaces/IReceipt.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Receipt is ERC721, IReceipt, AccessControl {
    using Strings for uint256;

    string internal BASE_URL; // Base URL for the receipt metadata
    uint256 internal _lastTokenId; // Tracks the last issued token ID
    mapping(uint256 => string) internal _tokenURIs; // Mapping from token ID to metadata URI

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(
        string memory baseURI_,
        address CONTROLLER
    ) ERC721("Beam Receipt", "BMRPT") {
        BASE_URL = baseURI_;
        _grantRole(DEFAULT_ADMIN_ROLE, CONTROLLER);
    }

    function mint(
        Params.MintReceipt memory params
    ) external override onlyRole(MINTER_ROLE) {
        _beforeNewReceipt();

        // Mint the receipt NFT
        _mint(params.to, _lastTokenId);

        // Set the token URI
        _tokenURIs[_lastTokenId] = params.URI;

        emit ReceiptMinted(params.to, _lastTokenId, params.transactionId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function baseURI() public view override returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal view override returns (string memory) {
        return BASE_URL;
    }

    function _beforeNewReceipt() internal {
        _lastTokenId = _lastTokenId + 1;
    }

    function grantRole(
        address account,
        bytes32 role
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, account);
    }

    // Explicitly override supportsInterface
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
