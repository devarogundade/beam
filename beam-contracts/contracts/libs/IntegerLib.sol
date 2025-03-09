// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title IntegerLib
 * @dev A library for utility functions to handle arrays and individual uint256 values.
 * @notice Provides reusable methods for validating and manipulating uint256 values.
 */
library IntegerLib {
    /**
     * @notice Checks if every element in the array is greater than zero.
     * @param value The array of uint256 values to validate.
     * @return Returns `true` if all elements are greater than zero, otherwise `false`.
     * @dev This function is useful for ensuring that all elements in an array meet a specific condition (in this case, being non-zero).
     */
    function every(uint256[] calldata value) external pure returns (bool) {
        for (uint256 i = 0; i < value.length; i++) {
            if (value[i] == 0) {
                return false; // Return false as soon as a zero is found
            }
        }
        return true; // All elements are greater than zero
    }

    /**
     * @notice Requires every uint256 in the array to be non-zero.
     * @param value The array of uint256 values to validate.
     * @dev Reverts the transaction if any uint256 value in the array is zero.
     * @dev Useful to enforce that all elements meet a condition before proceeding.
     */
    function requireEvery(uint256[] calldata value) external pure {
        for (uint256 i = 0; i < value.length; i++) {
            require(value[i] != 0, "IntegerLib: Zero uint256 found");
        }
    }

    /**
     * @notice Requires the uint256 value to be non-zero.
     * @param value The uint256 value to validate.
     * @dev Reverts the transaction if the uint256 value is zero.
     * @dev This function is useful when a single value must meet the condition before proceeding.
     */
    function requireOne(uint256 value) external pure {
        require(value != 0, "IntegerLib: Zero uint256 provided");
    }
}
