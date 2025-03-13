export const oracleAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "usd",
        type: "address",
      },
      {
        internalType: "contract IChainlink",
        name: "chainlink",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountInUsd",
        type: "uint256",
      },
    ],
    name: "getAmountFromUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    name: "getAmountInUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "amountInUsd",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
