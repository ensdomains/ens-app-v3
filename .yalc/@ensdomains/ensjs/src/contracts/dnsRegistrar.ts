export const dnsRegistrarErrors = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'name',
        type: 'bytes',
      },
    ],
    name: 'InvalidPublicSuffix',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoOwnerRecordFound',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'offset',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'OffsetOutOfBoundsError',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'PermissionDenied',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PreconditionNotMet',
    type: 'error',
  },
  {
    inputs: [],
    name: 'StaleProof',
    type: 'error',
  },
] as const

export const dnsRegistrarProveAndClaimSnippet = [
  ...dnsRegistrarErrors,
  {
    inputs: [
      {
        name: 'name',
        type: 'bytes',
      },
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
    name: 'proveAndClaim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const dnsRegistrarProveAndClaimWithResolverSnippet = [
  ...dnsRegistrarErrors,
  {
    inputs: [
      {
        name: 'name',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'bytes',
            name: 'rrset',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
        ],
        name: 'input',
        type: 'tuple[]',
      },
      {
        name: 'resolver',
        type: 'address',
      },
      {
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'proveAndClaimWithResolver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
