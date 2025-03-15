export const aaveV3Abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "wethGateway_",
        type: "address",
      },
      {
        internalType: "address",
        name: "poolAddressesProvider_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
          {
            internalType: "address",
            name: "supplyAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "requiredSupplyMin",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "borrowAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "borrowAmount",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            internalType: "struct Params.Signature",
            name: "signature",
            type: "tuple",
          },
        ],
        internalType: "struct Params.ExecuteLoan",
        name: "params",
        type: "tuple",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "supplyAsset",
        type: "address",
      },
    ],
    name: "getCurrentLiquidityRate",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
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
        name: "payer",
        type: "address",
      },
    ],
    name: "getHealthFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "hf",
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
        name: "asset",
        type: "address",
      },
    ],
    name: "getVariableDebtTokenAddresses",
    outputs: [
      {
        internalType: "address",
        name: "variableDebtToken",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
          {
            internalType: "address",
            name: "borrowAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "borrowAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "supplyAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "healthFactorMultiplier",
            type: "uint256",
          },
        ],
        internalType: "struct Params.RequiredSupply",
        name: "params",
        type: "tuple",
      },
    ],
    name: "requiredSupplyMin",
    outputs: [
      {
        internalType: "uint256",
        name: "additionalCollateral",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
