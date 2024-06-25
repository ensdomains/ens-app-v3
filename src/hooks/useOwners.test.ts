import { renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { makeMockUseAbilitiesData } from '../../test/mock/makeMockUseAbilitiesData'
import { makeMockUseDnsOwnerData } from '../../test/mock/makeMockUseDnsOwnerData'
import { makeMockUseOwnerData } from '../../test/mock/makeMockUseOwnerData'
import {
  makeMockUseOwners,
  mockUseOwnersConfigMap,
  mockUseOwnersTypes,
} from '../../test/mock/makeMockUseOwners'
import { makeMockUseWrapperDataData } from '../../test/mock/makeMockUseWrapperDataData.ts'
import { useOwners } from './useOwners'

describe('useOwners', () => {
  describe('mocks', () => {
    it.each(mockUseOwnersTypes)(`should return the correct data for type %s`, (type) => {
      const config = mockUseOwnersConfigMap[type]
      const { ownerType, wrapperDataType, dnsOwnerType, abilitiesType } = config
      const { result } = renderHook(() =>
        useOwners({
          ownerData: makeMockUseOwnerData(ownerType),
          wrapperData: makeMockUseWrapperDataData(wrapperDataType),
          dnsOwner: makeMockUseDnsOwnerData(dnsOwnerType),
          abilities: makeMockUseAbilitiesData(abilitiesType),
        }),
      )
      const expected = makeMockUseOwners(type)
      expect(result.current).toEqual(expected)
    })
  })
})
