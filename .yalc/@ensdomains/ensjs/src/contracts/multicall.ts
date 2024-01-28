export const multicallTryAggregateSnippet = [
  {
    inputs: [
      {
        name: 'requireSuccess',
        type: 'bool',
      },
      {
        components: [
          {
            name: 'target',
            type: 'address',
          },
          {
            name: 'callData',
            type: 'bytes',
          },
        ],
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        components: [
          {
            name: 'success',
            type: 'bool',
          },
          {
            name: 'returnData',
            type: 'bytes',
          },
        ],
        name: 'returnData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export const multicallGetCurrentBlockTimestampSnippet = [
  {
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [
      {
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
