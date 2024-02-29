import { renderHook } from '@app/test-utils'

import { match, P } from 'ts-pattern'
import { Address } from 'viem'
import { describe, expect, it } from 'vitest'

import { createMockOwnerData } from '@app/hooks/ensjs/public/useOwner.test'
import { createMockWrapperData } from '@app/hooks/ensjs/public/useWrapperData.test'

import { NameType } from './nameType/getNameType'
import { useOwners } from './useOwners'

const TEST_MATRIX = {
  'eth-unwrapped-2ld': {},
   'eth-emancipated-2ld': {},
    'eth-locked-2ld': {},
      'eth-grace-period-emancipated-2ld': {},
        'eth-grace-period-locked-2ld': {},
        'eth-grace-period-unwrapped-2ld': {ownerData: { registrant: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address }},
}

const createMockUseOwners = (nameType: NameType): ReturnType<typeof useOwners> | undefined =>
  match(nameType)
    .with(P.union('eth-unwrapped-2ld', 'eth-grace-period-unwrapped-2ld'), (nameType_) => [
      {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
        canTransfer: nameType_.includes('grace-period') ? false : true,
        transferType: 'manager' as const,
        label: 'name.manager',
        description: 'details.descriptions.controller',
        testId: 'owner-button-owner',
      },
      {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
        canTransfer: true,
        transferType: 'owner' as const,
        label: 'name.owner',
        description: 'details.descriptions.registrant',
        testId: 'owner-button-registrant',
      },
    ])
    .with(P.union('eth-emancipated-2ld', 'eth-locked-2ld', 'eth-grace-period-emancipated-2ld', 'eth-grace-period-locked-2ld'), (nameType_) => [
      {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
        canTransfer: nameType_.includes('grace-period') ? false : true,
        transferType: 'owner' as const,
        label: 'name.owner',
        description: 'details.descriptions.owner',
        testId: 'owner-button-owner',
      },
    ])
    .otherwise(() => undefined)

const DATA: [NameType, any][] = [
  ['eth-unwrapped-2ld', undefined],
  ['eth-emancipated-2ld', undefined],
  ['eth-locked-2ld', undefined],
  ['eth-grace-period-emancipated-2ld', undefined],
  ['eth-grace-period-locked-2ld', undefined],
  ['eth-grace-period-unwrapped-2ld', {ownerData: { registrant: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address }}],
]

describe('useOwners', () => {
  it.each(DATA)(`should return the correct data for a %s`, (nameType, overrides) => {
    const { result } = renderHook(() =>
      useOwners({
        ownerData: createMockOwnerData(nameType, overrides?.ownerData),
        wrapperData: createMockWrapperData(nameType),
        dnsOwner: nameType.includes('dns') ? undefined : undefined,
        abilities: {
          canSend: true,
          canSendOwner: true,
          canSendManager: true,
        } as any,
      }),
    )
    const expected = createMockUseOwners(nameType) || []
    expect(expected.length).toBeGreaterThan(0)
    for (const expectedItem of expected) {
      expect(result.current).toEqual(
        expect.arrayContaining([expect.objectContaining(expectedItem)]),
      )
    }
  })
})
