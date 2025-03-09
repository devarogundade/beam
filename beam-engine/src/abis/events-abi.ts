/* eslint-disable prettier/prettier */

export const eventsAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'CONTROLLER',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AccessControlBadConfirmation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'neededRole',
        type: 'bytes32',
      },
    ],
    name: 'AccessControlUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'hook',
        type: 'address',
      },
    ],
    name: 'HookRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'hook',
        type: 'address',
      },
    ],
    name: 'HookUnRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'signers',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minSigners',
        type: 'uint256',
      },
    ],
    name: 'MerchantCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
    ],
    name: 'MerchantMetadataUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'payers',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
      {
        indexed: false,
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'OneTimeTransactionCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'OneTimeTransactionFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
    ],
    name: 'TransactionReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
    ],
    name: 'RecurrentTransactionCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'dueDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
      {
        indexed: false,
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'RecurrentTransactionCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'dueDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'RecurrentTransactionFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interval',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gracePeriod',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'SubscriptionCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'signer',
        type: 'address',
      },
    ],
    name: 'WithdrawRequestApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'signers',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'executed',
        type: 'bool',
      },
    ],
    name: 'WithdrawRequestCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'WithdrawRequestExecuted',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BEAM_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'HOOK_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MERCHANT_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WALLET_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'hook',
        type: 'address',
      },
    ],
    name: 'hookRegistered',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'hook',
        type: 'address',
      },
    ],
    name: 'hookUnRegistered',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: 'signers',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'minSigners',
        type: 'uint256',
      },
    ],
    name: 'merchantCreated',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
    ],
    name: 'merchantUpdated',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'payers',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
      {
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'oneTimeTransactionCreated',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'oneTimeTransactionFulfilled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
    ],
    name: 'paymentReceived',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
    ],
    name: 'recurrentTransactionCancelled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'dueDate',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'schemaVersion',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
          },
        ],
        internalType: 'struct Types.Metadata',
        name: 'metadata',
        type: 'tuple',
      },
      {
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'recurrentTransactionCreated',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'transactionId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'dueDate',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'adjustedToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'adjustedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'enum Enums.TransactionStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'recurrentTransactionFulfilled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'callerConfirmation',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'revokeMinterRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'interval',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'gracePeriod',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'subscriptionCreated',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'signer',
        type: 'address',
      },
    ],
    name: 'withdrawRequestApproved',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'signers',
        type: 'address[]',
      },
      {
        internalType: 'bool',
        name: 'executed',
        type: 'bool',
      },
    ],
    name: 'withdrawRequestCreated',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'merchant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'withdrawRequestExecuted',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
