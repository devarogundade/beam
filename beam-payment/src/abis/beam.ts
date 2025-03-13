export const beamAbi = [
  {
    inputs: [
      {
        internalType: "contract IBeamEvents",
        name: "events_",
        type: "address",
      },
      {
        internalType: "contract IMerchant",
        name: "merchant_",
        type: "address",
      },
      {
        internalType: "contract IOneTimeTransaction",
        name: "oneTimeTransaction_",
        type: "address",
      },
      {
        internalType: "contract IRecurrentTransaction",
        name: "recurrentTransaction_",
        type: "address",
      },
      {
        internalType: "contract IHookManager",
        name: "hookManager_",
        type: "address",
      },
      {
        internalType: "contract IAaveV3",
        name: "aave_",
        type: "address",
      },
      {
        internalType: "contract IUniswap",
        name: "uniswap_",
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
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
        ],
        internalType: "struct Params.CancelRecurrentTransaction",
        name: "params",
        type: "tuple",
      },
    ],
    name: "cancelRecurrentTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
          {
            internalType: "bool",
            name: "mintReceipt",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "healthFactorMultiplier",
            type: "uint256",
          },
          {
            internalType: "enum Enums.TransactionRoute",
            name: "route",
            type: "uint8",
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
        internalType: "struct Params.FulfillOneTimeTransaction",
        name: "params",
        type: "tuple",
      },
    ],
    name: "fulfillOneTimeTransaction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
          {
            internalType: "bool",
            name: "mintReceipt",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "healthFactorMultiplier",
            type: "uint256",
          },
          {
            internalType: "enum Enums.TransactionRoute",
            name: "route",
            type: "uint8",
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
        internalType: "struct Params.FulfillRecurrentTransaction",
        name: "params",
        type: "tuple",
      },
    ],
    name: "fulfillRecurrentTransaction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "merchant",
            type: "address",
          },
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Params.AdjustTokenAmount",
        name: "params",
        type: "tuple",
      },
    ],
    name: "getAdjustTokenAmount",
    outputs: [
      {
        internalType: "address",
        name: "adjustedToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "adjustedAmount",
        type: "uint256",
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
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
        ],
        internalType: "struct Params.MintReceipt",
        name: "params",
        type: "tuple",
      },
    ],
    name: "mintOneTimeTransactionReceipt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
        ],
        internalType: "struct Params.MintReceipt",
        name: "params",
        type: "tuple",
      },
    ],
    name: "mintRecurrentTransactionReceipt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address[]",
            name: "payers",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "merchant",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint8",
                name: "schemaVersion",
                type: "uint8",
              },
              {
                internalType: "string",
                name: "value",
                type: "string",
              },
            ],
            internalType: "struct Types.Metadata",
            name: "metadata",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "mintReceipt",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "healthFactorMultiplier",
            type: "uint256",
          },
          {
            internalType: "enum Enums.TransactionRoute",
            name: "route",
            type: "uint8",
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
        internalType: "struct Params.CreateOneTimeTransaction",
        name: "params",
        type: "tuple",
      },
    ],
    name: "oneTimeTransaction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
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
            name: "merchant",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "subscriptionId",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint8",
                name: "schemaVersion",
                type: "uint8",
              },
              {
                internalType: "string",
                name: "value",
                type: "string",
              },
            ],
            internalType: "struct Types.Metadata",
            name: "metadata",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "mintReceipt",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "healthFactorMultiplier",
            type: "uint256",
          },
          {
            internalType: "enum Enums.TransactionRoute",
            name: "route",
            type: "uint8",
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
        internalType: "struct Params.CreateRecurrentTransaction",
        name: "params",
        type: "tuple",
      },
    ],
    name: "recurrentTransaction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
