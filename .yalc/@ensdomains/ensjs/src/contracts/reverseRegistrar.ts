export const reverseRegistrarSetNameForAddrSnippet = [
  {
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'resolver',
        type: 'address',
      },
      {
        name: 'name',
        type: 'string',
      },
    ],
    name: 'setNameForAddr',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const reverseRegistrarSetNameSnippet = [
  {
    inputs: [
      {
        name: 'name',
        type: 'string',
      },
    ],
    name: 'setName',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
