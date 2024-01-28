export const universalResolverErrors = [
  {
    inputs: [],
    name: 'ResolverNotFound',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ResolverWildcardNotSupported',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ResolverNotContract',
    type: 'error',
  },
  {
    inputs: [
      {
        name: 'returnData',
        type: 'bytes',
      },
    ],
    name: 'ResolverError',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            name: 'status',
            type: 'uint16',
          },
          {
            name: 'message',
            type: 'string',
          },
        ],
        name: 'errors',
        type: 'tuple[]',
      },
    ],
    name: 'HttpError',
    type: 'error',
  },
] as const

const universalResolverReverse = {
  inputs: [
    {
      name: 'reverseName',
      type: 'bytes',
    },
  ],
  name: 'reverse',
  outputs: [
    { type: 'string', name: 'resolvedName' },
    { type: 'address', name: 'resolvedAddress' },
    { type: 'address', name: 'reverseResolver' },
    { type: 'address', name: 'resolver' },
  ],
  stateMutability: 'view',
  type: 'function',
} as const

export const universalResolverReverseSnippet = [
  ...universalResolverErrors,
  universalResolverReverse,
  {
    ...universalResolverReverse,
    inputs: [
      ...universalResolverReverse.inputs,
      {
        name: 'gateways',
        type: 'string[]',
      },
    ],
  },
] as const

const universalResolverResolve = {
  inputs: [
    {
      name: 'name',
      type: 'bytes',
    },
    {
      name: 'data',
      type: 'bytes',
    },
  ],
  name: 'resolve',
  outputs: [
    {
      name: 'data',
      type: 'bytes',
    },
    {
      name: 'resolver',
      type: 'address',
    },
  ],
  stateMutability: 'view',
  type: 'function',
} as const

export const universalResolverResolveSnippet = [
  ...universalResolverErrors,
  universalResolverResolve,
  {
    ...universalResolverResolve,
    inputs: [
      ...universalResolverResolve.inputs,
      {
        name: 'gateways',
        type: 'string[]',
      },
    ],
  },
] as const

const universalResolverResolveArray = {
  inputs: [
    {
      name: 'name',
      type: 'bytes',
    },
    {
      name: 'data',
      type: 'bytes[]',
    },
  ],
  name: 'resolve',
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
      name: '',
      type: 'tuple[]',
    },
    {
      name: '',
      type: 'address',
    },
  ],
  stateMutability: 'view',
  type: 'function',
} as const

export const universalResolverResolveArraySnippet = [
  ...universalResolverErrors,
  universalResolverResolveArray,
  {
    ...universalResolverResolveArray,
    inputs: [
      ...universalResolverResolveArray.inputs,
      {
        name: 'gateways',
        type: 'string[]',
      },
    ],
  },
] as const

export const universalResolverFindResolverSnippet = [
  ...universalResolverErrors,
  {
    inputs: [
      {
        name: 'name',
        type: 'bytes',
      },
    ],
    name: 'findResolver',
    outputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
