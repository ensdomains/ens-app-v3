import { erc1155SafeTransferFromSnippet } from './erc1155.js'
import { erc721OwnerOfSnippet } from './erc721.js'
import { registrySetResolverSnippet } from './registry.js'

export const nameWrapperErrors = [
  {
    inputs: [],
    name: 'CannotUpgrade',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IncompatibleParent',
    type: 'error',
  },
  {
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'IncorrectTargetOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IncorrectTokenType',
    type: 'error',
  },
  {
    inputs: [
      {
        name: 'labelHash',
        type: 'bytes32',
      },
      {
        name: 'expectedLabelhash',
        type: 'bytes32',
      },
    ],
    name: 'LabelMismatch',
    type: 'error',
  },
  {
    inputs: [
      {
        name: 'label',
        type: 'string',
      },
    ],
    name: 'LabelTooLong',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LabelTooShort',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NameIsNotWrapped',
    type: 'error',
  },
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
    ],
    name: 'OperationProhibited',
    type: 'error',
  },
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'Unauthorised',
    type: 'error',
  },
] as const

export const nameWrapperGetDataSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getData',
    outputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'fuses',
        type: 'uint32',
      },
      {
        name: 'expiry',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const nameWrapperSetFusesSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
      {
        name: 'ownerControlledFuses',
        type: 'uint16',
      },
    ],
    name: 'setFuses',
    outputs: [
      {
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperSetChildFusesSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'parentNode',
        type: 'bytes32',
      },
      {
        name: 'labelhash',
        type: 'bytes32',
      },
      {
        name: 'fuses',
        type: 'uint32',
      },
      {
        name: 'expiry',
        type: 'uint64',
      },
    ],
    name: 'setChildFuses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperSetSubnodeRecordSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'parentNode',
        type: 'bytes32',
      },
      {
        name: 'label',
        type: 'string',
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
        name: 'ttl',
        type: 'uint64',
      },
      {
        name: 'fuses',
        type: 'uint32',
      },
      {
        name: 'expiry',
        type: 'uint64',
      },
    ],
    name: 'setSubnodeRecord',
    outputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperSetRecordSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
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
        name: 'ttl',
        type: 'uint64',
      },
    ],
    name: 'setRecord',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperSetSubnodeOwnerSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'parentNode',
        type: 'bytes32',
      },
      {
        name: 'label',
        type: 'string',
      },
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'fuses',
        type: 'uint32',
      },
      {
        name: 'expiry',
        type: 'uint64',
      },
    ],
    name: 'setSubnodeOwner',
    outputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperWrapSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'name',
        type: 'bytes',
      },
      {
        name: 'wrappedOwner',
        type: 'address',
      },
      {
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'wrap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperUnwrapSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'parentNode',
        type: 'bytes32',
      },
      {
        name: 'labelhash',
        type: 'bytes32',
      },
      {
        name: 'controller',
        type: 'address',
      },
    ],
    name: 'unwrap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperUnwrapEth2ldSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: 'labelhash',
        type: 'bytes32',
      },
      {
        name: 'registrant',
        type: 'address',
      },
      {
        name: 'controller',
        type: 'address',
      },
    ],
    name: 'unwrapETH2LD',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const nameWrapperNamesSnippet = [
  ...nameWrapperErrors,
  {
    inputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'names',
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

export const nameWrapperSafeTransferFromSnippet = [
  ...nameWrapperErrors,
  ...erc1155SafeTransferFromSnippet,
] as const

export const nameWrapperOwnerOfSnippet = [
  ...nameWrapperErrors,
  ...erc721OwnerOfSnippet,
] as const

export const nameWrapperSetResolverSnippet = [
  ...nameWrapperErrors,
  ...registrySetResolverSnippet,
] as const
