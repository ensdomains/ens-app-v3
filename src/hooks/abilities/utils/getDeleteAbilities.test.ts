import { describe, expect, it } from 'vitest'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { useBasicName } from '@app/hooks/useBasicName'
import { DeepPartial } from '@app/types'
import { emptyAddress } from '@app/utils/constants'

import { useAbilities } from '../useAbilities'
import { getDeleteAbilities } from './getDeleteAbilities'

type WrapperData = NonNullable<GetWrapperDataReturnType>
const makeWrapperData = (overrides: DeepPartial<WrapperData> = {}) => {
  return {
    owner: '0x0000000000000000000000000000000000000000',
    ...overrides,
    fuses: {
      ...overrides.fuses,
      parent: {
        PARENT_CANNOT_CONTROL: false,
        CAN_EXTEND_EXPIRY: false,
        ...overrides.fuses?.parent,
      },
      child: {
        CANNOT_UNWRAP: false,
        CANNOT_BURN_FUSES: false,
        CANNOT_TRANSFER: false,
        CANNOT_SET_RESOLVER: false,
        CANNOT_SET_TTL: false,
        CANNOT_CREATE_SUBDOMAIN: false,
        CANNOT_APPROVE: false,
        ...overrides.fuses?.child,
      },
    },
  } as WrapperData
}

type OwnerData = ReturnType<typeof useBasicName>['ownerData']
const makeOwnerData = (overrides: DeepPartial<OwnerData> = {}) => {
  return {
    registrant: '0xRegistrant',
    owner: '0x0000000000000000000000000000000000000000',
    ownershipLevel: 'registrar',
    ...overrides,
  } as OwnerData
}

type Abilities = ReturnType<typeof useAbilities>['data']
const makeResults = (overrides: DeepPartial<Abilities> = {}) => {
  return {
    canDelete: false,
    ...overrides,
  } as Abilities
}

const unwrapped2LDEth = {
  parentOwnerData: makeOwnerData({
    ownershipLevel: 'registry',
    owner: '0xParent',
  }),
  parentWrapperData: makeWrapperData(),
  isParentWrapped: false,
  name: 'test.eth',
  ownerData: makeOwnerData({
    ownershipLevel: 'registrar',
    owner: '0xName',
  }),
  wrapperData: makeWrapperData(),
  hasSubnames: false,
}

const wrapped2LDEth = {
  parentOwnerData: makeOwnerData({
    ownershipLevel: 'registry',
    owner: '0xParent',
  }),
  parentWrapperData: makeWrapperData(),
  isParentWrapped: true,
  name: 'test.eth',
  ownerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xName',
  }),
  wrapperData: makeWrapperData({
    fuses: {
      parent: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    owner: '0xName',
  }),
  hasSubnames: false,
}

const unwrappedSubname = {
  parentOwnerData: makeOwnerData({
    ownershipLevel: 'registrar',
    owner: '0xParent',
  }),
  parentWrapperData: makeWrapperData(),
  isParentWrapped: false,
  name: 'sub.test.eth',
  ownerData: makeOwnerData({
    ownershipLevel: 'registry',
    owner: '0xName',
  }),
  wrapperData: makeWrapperData(),
}

const wrappedSubname = {
  parentOwnerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xParent',
  }),
  parentWrapperData: makeWrapperData({
    fuses: {
      parent: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    owner: '0xParent',
  }),
  isParentWrapped: true,
  name: 'sub.test.eth',
  ownerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xName',
  }),
  wrapperData: makeWrapperData({
    owner: '0xName',
  }),
}

const expiredWrappedSubname = {
  parentOwnerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xParent',
  }),
  parentWrapperData: makeWrapperData({
    fuses: {
      parent: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    owner: '0xParent',
  }),
  isParentWrapped: true,
  name: 'sub.test.eth',
  ownerData: makeOwnerData({
    ownershipLevel: 'registry',
    owner: '0xNameWrapper',
  }),
  wrapperData: makeWrapperData({
    owner: emptyAddress,
  }),
}

const wrappedSubnameWithPCCBurned = {
  parentOwnerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xParent',
  }),
  parentWrapperData: makeWrapperData({
    fuses: {
      parent: {
        PARENT_CANNOT_CONTROL: true,
      },
      child: {
        CANNOT_UNWRAP: true,
      },
    },
  }),
  isParentWrapped: true,
  name: 'sub.test.eth',
  ownerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xName',
  }),
  wrapperData: makeWrapperData({
    fuses: {
      parent: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    owner: '0xName',
  }),
}

const groups = [
  {
    description: 'unwrapped 2LDEth',
    tests: [
      {
        description: 'should return false if user is parent owner',
        ...unwrapped2LDEth,
        hasSubnames: false,
        address: '0xParent',
        abilities: makeResults({ canDelete: false }),
      },
      {
        description: 'should return false if user is owner',
        ...unwrapped2LDEth,
        hasSubnames: false,
        address: '0xName',
        abilities: makeResults({ canDelete: false }),
      },
    ],
  },
  {
    description: 'wrapped 2LDEth',
    tests: [
      {
        description: 'should return false if user is parent owner',
        ...wrapped2LDEth,
        hasSubnames: false,
        address: '0xParent',
        abilities: makeResults({ canDelete: false }),
      },
      {
        description: 'should return false if user is name owner',
        ...wrapped2LDEth,
        address: '0xName',
        abilities: makeResults({ canDelete: false }),
      },
    ],
  },
  {
    description: 'unwrapped subname',
    tests: [
      {
        description: 'should return canDelete is true if user is parent owner',
        ...unwrappedSubname,
        hasSubnames: false,
        address: '0xParent',
        abilities: makeResults({
          canDelete: true,
          canDeleteContract: 'registry',
          canDeleteMethod: 'setSubnodeOwner',
          canDeleteRequiresWrap: false,
          isParentOwner: true,
        }),
      },
      {
        description:
          'should return canDelete is false if user is parent owner and name has subnames',
        ...unwrappedSubname,
        hasSubnames: true,
        address: '0xParent',
        abilities: makeResults({
          canDelete: false,
          canDeleteContract: 'registry',
          canDeleteError: 'errors.hasSubnames',
          canDeleteMethod: 'setSubnodeOwner',
          canDeleteRequiresWrap: false,
          isParentOwner: true,
        }),
      },
      {
        description: 'should return canDelete is true if user is name owner',
        ...unwrappedSubname,
        hasSubnames: false,
        address: '0xName',
        abilities: makeResults({
          canDelete: true,
          canDeleteContract: 'registry',
          canDeleteMethod: 'setRecord',
          canDeleteRequiresWrap: false,
          isParentOwner: false,
        }),
      },
      {
        description:
          'should return canDelete is true and canDeleteRequiresWrap is false if parent is wrapped and user is name owner',
        ...unwrappedSubname,
        hasSubnames: false,
        address: '0xParent',
        isParentWrapped: true,
        parentOwnerData: makeOwnerData({
          owner: '0xParent',
          ownershipLevel: 'nameWrapper',
        }),
        ownerData: makeOwnerData({
          ownershipLevel: 'registry',
          owner: '0xParent',
        }),
        abilities: makeResults({
          canDelete: true,
          canDeleteContract: 'registry',
          canDeleteRequiresWrap: false,
          canDeleteMethod: 'setRecord',
          isParentOwner: true,
        }),
      },
      {
        description:
          'should return canDelete is true and canDeleteRequiresWrap is true if parent is wrapped',
        ...unwrappedSubname,
        hasSubnames: false,
        address: '0xParent',
        isParentWrapped: true,
        parentOwnerData: makeOwnerData({
          owner: '0xParent',
          ownershipLevel: 'nameWrapper',
        }),
        abilities: makeResults({
          canDelete: true,
          canDeleteContract: 'nameWrapper',
          canDeleteMethod: 'setSubnodeOwner',
          canDeleteRequiresWrap: true,
          isParentOwner: true,
        }),
      },
    ],
  },
  {
    description: 'wrapped subname',
    tests: [
      {
        description: 'should return canDelete is true if user is parent owner',
        ...wrappedSubname,
        hasSubnames: false,
        address: '0xParent',
        abilities: makeResults({
          canDelete: true,
          canDeleteContract: 'nameWrapper',
          canDeleteMethod: 'setSubnodeOwner',
          isPCCBurned: false,
          isParentOwner: true,
        }),
      },
      {
        description:
          'should return canDelete is false if user is parent owner and name has subnames',
        ...wrappedSubname,
        hasSubnames: true,
        address: '0xParent',
        abilities: makeResults({
          canDelete: false,
          canDeleteContract: 'nameWrapper',
          canDeleteMethod: 'setSubnodeOwner',
          canDeleteError: 'errors.hasSubnames',
          isPCCBurned: false,
          isParentOwner: true,
        }),
      },
      {
        description: 'should return canDelete is true if user is name owner',
        ...wrappedSubname,
        hasSubnames: false,
        address: '0xName',
        abilities: makeResults({
          canDelete: true,
          canDeleteContract: 'nameWrapper',
          canDeleteMethod: 'setRecord',
          isPCCBurned: false,
          isParentOwner: false,
        }),
      },
      {
        description: 'should return canDelete is false if user is name owner and name has subnames',
        ...wrappedSubname,
        hasSubnames: true,
        address: '0xName',
        abilities: makeResults({
          canDelete: false,
          canDeleteContract: 'nameWrapper',
          canDeleteMethod: 'setRecord',
          canDeleteError: 'errors.hasSubnames',
          isPCCBurned: false,
          isParentOwner: false,
        }),
      },
      {
        description:
          'should return canDelete is false if the use is the name owner and the subname has expired',
        ...expiredWrappedSubname,
        hasSubnames: false,
        address: '0xParent',
        pccExpired: true,
        abilities: makeResults({
          canDelete: false,
          canDeleteContract: 'registry',
          canDeleteMethod: 'setSubnodeOwner',
          canDeleteRequiresWrap: false,
          isParentOwner: true,
        }),
      },
    ],
  },
  {
    description: 'wrapped subname with PCC burned',
    tests: [
      {
        description: 'should return canDelete is true if user is name owner',
        ...wrappedSubnameWithPCCBurned,
        hasSubnames: false,
        address: '0xName',
        abilities: makeResults({
          canDelete: true,
          canDeleteContract: 'nameWrapper',
          canDeleteMethod: 'setRecord',
          isPCCBurned: true,
          isParentOwner: false,
        }),
      },
      {
        description: 'should return canDelete is false if user is name owner and name has subnames',
        ...wrappedSubnameWithPCCBurned,
        hasSubnames: true,
        address: '0xName',
        abilities: makeResults({
          canDelete: false,
          canDeleteContract: 'nameWrapper',
          canDeleteMethod: 'setRecord',
          canDeleteError: 'errors.hasSubnames',
          isPCCBurned: true,
          isParentOwner: false,
        }),
      },
      {
        description: 'should return canDelete is false if user is parent owner',
        ...wrappedSubnameWithPCCBurned,
        hasSubnames: false,
        address: '0xParent',
        abilities: makeResults({ canDelete: false }),
      },
    ],
  },
]

describe('getDeleteAbilities', () => {
  groups.forEach((group) => {
    describe(group.description, () => {
      group.tests.forEach(
        ({
          description,
          parentOwnerData,
          parentWrapperData,
          hasSubnames,
          name,
          ownerData,
          wrapperData,
          address,
          abilities,
          ...rest
        }) => {
          it(description, () => {
            const basicNameData: any = {
              ownerData,
              wrapperData,
              pccExpired: !!(rest as any).pccExpired,
            }

            const parentBasicNameData: any = {
              ownerData: parentOwnerData,
              wrapperData: parentWrapperData,
            }

            const result = getDeleteAbilities({
              name,
              address,
              basicNameData,
              parentBasicNameData,
              hasSubnames,
              t: (...args) => args.join(','),
            })

            expect(result).toMatchObject(abilities || {})
          })
        },
      )
    })
  })
})
