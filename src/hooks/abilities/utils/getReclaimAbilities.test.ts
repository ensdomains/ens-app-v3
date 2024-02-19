import { describe, expect, it } from 'vitest'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { useBasicName } from '@app/hooks/useBasicName'
import { DeepPartial } from '@app/types'
import { emptyAddress } from '@app/utils/constants'

import { useAbilities } from '../useAbilities'
import { getReclaimAbilities } from './getReclaimAbilities'

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
    canReclaim: false,
    ...overrides,
  } as Abilities
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

const groups = [
  {
    description: 'reclaim subname',
    tests: [
      {
        description:
          'should return canReclaim is true if the user is the name owner and the subname has expired',
        ...expiredWrappedSubname,
        hasSubnames: false,
        address: '0xParent',
        pccExpired: true,
        abilities: makeResults({
          canReclaim: true,
        }),
      },
      {
        description:
          'should return canReclaim is false if the user is the name owner and the subname was not pcc expired',
        ...expiredWrappedSubname,
        hasSubnames: false,
        address: '0xParent',
        pccExpired: false,
        abilities: makeResults({
          canReclaim: false,
        }),
      },
    ],
  },
]

describe('getReclaimAbilities', () => {
  groups.forEach((group) => {
    describe(group.description, () => {
      group.tests.forEach(
        ({
          description,
          parentOwnerData,
          parentWrapperData,
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

            const result = getReclaimAbilities({
              address,
              basicNameData,
              parentBasicNameData,
            })

            expect(result).toMatchObject(abilities || {})
          })
        },
      )
    })
  })
})
