export const bulkRenewalRentPriceSnippet = [
  {
    inputs: [
      {
        name: 'names',
        type: 'string[]',
      },
      {
        name: 'duration',
        type: 'uint256',
      },
    ],
    name: 'rentPrice',
    outputs: [
      {
        name: 'total',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const bulkRenewalRenewAllSnippet = [
  {
    inputs: [
      {
        name: 'names',
        type: 'string[]',
      },
      {
        name: 'duration',
        type: 'uint256',
      },
    ],
    name: 'renewAll',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
