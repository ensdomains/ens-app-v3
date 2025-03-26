export const erc165SupportsInterfaceSnippet = [
  {
    inputs: [
      {
        name: 'interfaceID',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
] as const
