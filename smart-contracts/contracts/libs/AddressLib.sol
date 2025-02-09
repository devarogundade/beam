// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title AddressLib
 * @dev A library for common address-related utility functions.
 * @notice Provides reusable methods for validating and checking addresses, such as ensuring addresses are non-zero.
 */
library AddressLib {
    /**
     * @notice Checks if every address in the array is non-zero.
     * @param value The array of address values to validate.
     * @return Returns `true` if all addresses are non-zero, otherwise `false`.
     * @dev Useful for bulk address validation in scenarios such as batch operations.
     */
    function every(address[] calldata value) external pure returns (bool) {
        for (uint256 i = 0; i < value.length; i++) {
            if (value[i] == address(0)) {
                return false; // Return false as soon as a zero address is found
            }
        }
        return true; // All addresses are non-zero
    }

    /**
     * @notice Validates that every address in the array is non-zero.
     * @param value The array of address values to validate.
     * @dev Reverts with an error if any address is zero. This is useful for enforcing input constraints.
     * @dev Error message: "AddressLib: Zero address found".
     */
    function requireEvery(address[] calldata value) external pure {
        for (uint256 i = 0; i < value.length; i++) {
            require(value[i] != address(0), "AddressLib: Zero address found");
        }
    }

    /**
     * @notice Validates that a single address is non-zero.
     * @param value The address value to validate.
     * @dev Reverts with an error if the address is zero. This is useful for validating critical single address inputs.
     * @dev Error message: "AddressLib: Zero address provided".
     */
    function requireOne(address value) external pure {
        require(value != address(0), "AddressLib: Zero address provided");
    }
}
