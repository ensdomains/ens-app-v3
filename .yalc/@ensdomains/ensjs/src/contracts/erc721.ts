export const erc721OwnerOfSnippet = [
  {
    inputs: [
      {
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const erc721SafeTransferFromSnippet = [
  {
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const erc721SafeTransferFromWithDataSnippet = [
  {
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
