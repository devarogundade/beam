// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

library Enums {
    enum TransactionStatus {
        Pending,
        Active,
        Completed,
        Cancelled
    }

    enum TransactionRoute {
        None,
        Uniswap,
        Aave
    }

    enum TransactionType {
        OneTime,
        Recurrent
    }
}
