// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

library Enums {
    enum PaymentStatus {
        Pending,
        Active,
        Completed,
        Cancelled
    }

    enum PaymentRoute {
        None,
        Uniswap,
        Aave
    }

    enum PaymentType {
        OneTime,
        Recurrent
    }
}
