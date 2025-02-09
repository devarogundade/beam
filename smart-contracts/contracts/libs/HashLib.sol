// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title HashLib
 * @dev A library for generating unique hash identifiers using keccak256.
 */
library HashLib {
    /**
     * @dev Generates a unique hash by combining a string and a numeric identifier.
     * @param base A string input that serves as the base for the hash.
     * @param identifier A numeric identifier to add uniqueness to the hash.
     * @return A `bytes32` hash generated using keccak256.
     */
    function generate(
        string calldata base,
        uint256 identifier
    ) external pure returns (bytes32) {
        return keccak256(abi.encode(base, identifier));
    }

    function generateWithAddress(
        string calldata base,
        address user,
        uint256 identifier
    ) external pure returns (bytes32) {
        return keccak256(abi.encode(base, user, identifier));
    }
}
