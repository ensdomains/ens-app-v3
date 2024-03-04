import { mockFunction, renderHook } from '@app/test-utils'

import { match, P } from 'ts-pattern'
import { Address } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  makeMockUseAbilitiesData,
  mockUseAbilitiesConfig,
  mockUseAbilitiesTypes,
} from '../../../test/mock/makeMockUseAbilitiesData'
import { useAccountSafely } from '../account/useAccountSafely'
import { NameType } from '../nameType/getNameType'
import { useResolverIsAuthorised } from '../resolver/useResolverIsAuthorised'
import { useBasicName } from '../useBasicName'
import { useHasSubnames } from '../useHasSubnames'
import { DEFAULT_ABILITIES, useAbilities } from './useAbilities'
import { useParentBasicName } from '../useParentBasicName'
import { makeMockUseBasicName } from '../../../test/mock/makeMockUseBasicName'

vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/useParentBasicName')
vi.mock('@app/hooks/resolver/useResolverIsAuthorised')
vi.mock('@app/hooks/useHasSubnames')

const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseBasicName = mockFunction(useBasicName)
const mockUseParentBasicName = mockFunction(useParentBasicName)
const mockUseResolverIsAuthorised = mockFunction(useResolverIsAuthorised)
const mockUseHasSubnames = mockFunction(useHasSubnames)

describe('useAbilities', () => {
  describe('basic abilities', () => {
    const name = 'nick.eth'
    const ownerAddress = '0x123'
    const account = ownerAddress

    it('should return false for all send abilities if CANNOT_TRANSFER has been burned', () => {
      mockUseAccountSafely.mockReturnValue({ address: account })
      mockUseBasicName.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
          owner: account,
        },
        wrapperData: {
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_TRANSFER: true,
            },
          },
        },
      })
      mockUseResolverIsAuthorised.mockReturnValue({ data: { isAuthorised: true, isValid: true } })
      mockUseHasSubnames.mockReturnValue({ hasSubnames: false, isLoading: false })
      const { result } = renderHook(() => useAbilities({ name }))
      expect(result.current.data?.canSend).toBe(false)
    })
    it('should return canEditRecords as true if resolver is authorised', () => {
      mockUseAccountSafely.mockReturnValue({ address: account })
      mockUseBasicName.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
          owner: account,
        },
        wrapperData: {
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_SET_RESOLVER: true,
            },
          },
        },
      })
      mockUseResolverIsAuthorised.mockReturnValue({ data: { isAuthorised: true, isValid: true } })
      mockUseHasSubnames.mockReturnValue({ hasSubnames: false, isLoading: false })

      const { result } = renderHook(() => useAbilities({ name }))

      expect(result.current.data?.canEditRecords).toBe(true)
    })
  })

  // ownerdata , registrationStatus, pccExpired
  describe('mocks', () => {
    it.each(mockUseAbilitiesTypes)('should return expected data for %s', (type) => {
      const config = mockUseAbilitiesConfig[type]
      const { basicNameType, parentNameType, name } = config
      mockUseAccountSafely.mockReturnValue({
        address: createAccounts().getAddress('user') as Address,
      })
      mockUseBasicName.mockReturnValue(makeMockUseBasicName(basicNameType))
      mockUseParentBasicName.mockReturnValue(makeMockUseBasicName(parentNameType))
      mockUseResolverIsAuthorised.mockReturnValue({
        data: { isAuthorised: true, isValid: true },
        isLoading: false,
        isFetching: false,
      })
      const { result } = renderHook(() => useAbilities({ name: 'test.eth' }))
      const expected = makeMockUseAbilitiesData(type)
      expect(result.current.data).toEqual(expected)
    })
  })
})
