export const publicResolverSingleAddrSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
    ],
    name: 'addr',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const publicResolverMultiAddrSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'coinType',
        type: 'uint256',
      },
    ],
    name: 'addr',
    outputs: [
      {
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const publicResolverTextSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'key',
        type: 'string',
      },
    ],
    name: 'text',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const publicResolverContenthashSnippet = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'node',
        type: 'bytes32',
      },
    ],
    name: 'contenthash',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const publicResolverAbiSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'contentTypes',
        type: 'uint256',
      },
    ],
    name: 'ABI',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const publicResolverSetTextSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'key',
        type: 'string',
      },
      {
        name: 'value',
        type: 'string',
      },
    ],
    name: 'setText',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const publicResolverSetAddrSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'coinType',
        type: 'uint256',
      },
      {
        name: 'a',
        type: 'bytes',
      },
    ],
    name: 'setAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const publicResolverSetAbiSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'contentType',
        type: 'uint256',
      },
      {
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'setABI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const publicResolverSetContenthashSnippet = [
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'hash',
        type: 'bytes',
      },
    ],
    name: 'setContenthash',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const publicResolverClearRecordsSnippet = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'node',
        type: 'bytes32',
      },
    ],
    name: 'clearRecords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const publicResolverMulticallSnippet = [
  {
    inputs: [
      {
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
