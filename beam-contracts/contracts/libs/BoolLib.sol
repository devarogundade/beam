// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title BoolLib
 * @dev A library for utility functions to handle boolean arrays.
 * @notice Provides reusable methods for evaluating boolean conditions on arrays.
 */
library BoolLib {
    /**
     * @notice Checks if every element in the array is `true`.
     * @param value The array of boolean values to validate.
     * @return Returns `true` if all elements in the array are `true`, otherwise `false`.
     * @dev Useful for ensuring that all conditions in a collection are satisfied.
     */
    function every(bool[] calldata value) external pure returns (bool) {
        for (uint256 i = 0; i < value.length; i++) {
            if (!value[i]) {
                return false; // Return false as soon as a `false` value is found
            }
        }
        return true; // All elements are `true`
    }

    /**
     * @notice Checks if no element in the array is `true`.
     * @param value The array of boolean values to validate.
     * @return Returns `true` if all elements in the array are `false`, otherwise `false`.
     * @dev Useful for ensuring that no conditions in a collection are satisfied.
     */
    function none(bool[] calldata value) external pure returns (bool) {
        for (uint256 i = 0; i < value.length; i++) {
            if (value[i]) {
                return false; // Return false as soon as a `true` value is found
            }
        }
        return true; // All elements are `false`
    }
}
