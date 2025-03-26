export const dnssecImplVerifyRrSetSnippet = [
  {
    inputs: [
      {
        components: [
          {
            name: 'rrset',
            type: 'bytes',
          },
          {
            name: 'sig',
            type: 'bytes',
          },
        ],
        name: 'input',
        type: 'tuple[]',
      },
    ],
    name: 'verifyRRSet',
    outputs: [
      {
        name: 'rrs',
        type: 'bytes',
      },
      {
        name: 'inception',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const dnssecImplAnchorsSnippet = [
  {
    inputs: [],
    name: 'anchors',
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
