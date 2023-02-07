import { mockFunction, renderHook } from '@app/test-utils'

import { DeepPartial } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'

import { useBasicName } from './useBasicName'
import { useHasSubnames } from './useHasSubnames'
import { useSubnameAbilities } from './useSubnameAbilities'

jest.mock('@app/hooks/useHasSubnames')
jest.mock('@app/hooks/useBasicName')

const mockUseBasicName = mockFunction(useBasicName)
const mockUseHasSubnames = mockFunction(useHasSubnames)

mockUseHasSubnames.mockReturnValue({
  hasSubnames: false,
  isLoading: false,
  isCachedData: false,
})

type WrapperData = Awaited<ReturnType<ReturnType<typeof useEns>['getWrapperData']>>
const makeWrapperData = (overrides: DeepPartial<WrapperData> = {}) => {
  const { parent = {}, child = {}, ...data } = overrides
  return {
    parent: {
      PARENT_CANNOT_CONTROL: false,
      CAN_EXTEND_EXPIRY: false,
      ...parent,
    },
    child: {
      CANNOT_UNWRAP: false,
      CANNOT_BURN_FUSES: false,
      CANNOT_TRANSFER: false,
      CANNOT_SET_RESOLVER: false,
      CANNOT_SET_TTL: false,
      CANNOT_CREATE_SUBDOMAIN: false,
      ...child,
    },
    owner: '0x0000000000000000000000000000000000000000',
    ...data,
  } as WrapperData
}

type OwnerData = Awaited<ReturnType<ReturnType<typeof useEns>['getOwner']>>
const makeOwnerData = (overrides: DeepPartial<OwnerData> = {}) => {
  return {
    registrant: '0xRegistrant',
    owner: '0x0000000000000000000000000000000000000000',
    ownershipLevel: 'registrar',
    expired: false,
    ...overrides,
  } as OwnerData
}

type Abilities = ReturnType<typeof useSubnameAbilities>['abilities']
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
    parent: {
      PARENT_CANNOT_CONTROL: true,
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
    parent: {
      PARENT_CANNOT_CONTROL: true,
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

const wrappedSubnameWithPCCBurned = {
  parentOwnerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xParent',
  }),
  parentWrapperData: makeWrapperData({
    parent: {
      PARENT_CANNOT_CONTROL: true,
    },
    child: {
      CANNOT_UNWRAP: true,
    },
  }),
  isParentWrapped: true,
  name: 'sub.test.eth',
  ownerData: makeOwnerData({
    ownershipLevel: 'nameWrapper',
    owner: '0xName',
  }),
  wrapperData: makeWrapperData({
    parent: {
      PARENT_CANNOT_CONTROL: true,
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
        abilities: makeResults({ canDelete: true, canDeleteContract: 'registry' }),
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
        }),
      },
      {
        description: 'should return canDelete is false if user is name owner',
        ...unwrappedSubname,
        hasSubnames: false,
        address: '0xName',
        abilities: makeResults({ canDelete: false }),
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
        abilities: makeResults({ canDelete: true, canDeleteContract: 'nameWrapper' }),
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
          canDeleteError: 'errors.hasSubnames',
        }),
      },
      {
        description: 'should return canDelete is true if user is name owner',
        ...wrappedSubname,
        hasSubnames: false,
        address: '0xName',
        abilities: makeResults({ canDelete: false }),
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
        abilities: makeResults({ canDelete: true, canDeleteContract: 'nameWrapper' }),
      },
      {
        description: 'should return canDelete is false if user is name owner and name has subnames',
        ...wrappedSubnameWithPCCBurned,
        hasSubnames: true,
        address: '0xName',
        abilities: makeResults({
          canDelete: false,
          canDeleteContract: 'nameWrapper',
          canDeleteError: 'errors.hasSubnames',
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

describe('useSubnameAbilities', () => {
  groups.forEach((group) => {
    describe(group.description, () => {
      group.tests.forEach(
        ({
          description,
          parentOwnerData,
          parentWrapperData,
          isParentWrapped,
          hasSubnames,
          name,
          ownerData,
          wrapperData,
          address,
          abilities,
        }) => {
          it(description, () => {
            mockUseBasicName.mockReturnValue({
              ownerData: parentOwnerData,
              wrapperData: parentWrapperData,
              isWrapped: isParentWrapped,
              isLoading: false,
              isCachedData: false,
            })
            mockUseHasSubnames.mockReturnValue({
              hasSubnames,
              isLoading: false,
              isCachedData: false,
            })
            const { result } = renderHook(() =>
              useSubnameAbilities({
                name,
                address,
                ownerData,
                wrapperData,
              }),
            )
            expect(result.current).toEqual({
              abilities,
              isLoading: false,
              isCachedData: false,
            })
          })
        },
      )
    })
  })
})
