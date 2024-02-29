import { mockFunction, renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useAccountSafely } from '../account/useAccountSafely'
import { useResolverIsAuthorised } from '../resolver/useResolverIsAuthorised'
import { useBasicName } from '../useBasicName'
import { useHasSubnames } from '../useHasSubnames'
import { DEFAULT_ABILITIES, useAbilities } from './useAbilities'
import { NameType } from '../nameType/getNameType'
import { match, P } from 'ts-pattern'
import { createAccounts } from '@root/playwright/fixtures/accounts'
import { Address } from 'viem'

vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/resolver/useResolverIsAuthorised')
vi.mock('@app/hooks/useHasSubnames')

const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseBasicName = mockFunction(useBasicName)
const mockUseResolverIsAuthorised = mockFunction(useResolverIsAuthorised)
const mockUseHasSubnames = mockFunction(useHasSubnames)

const MockUseAbilitesTestConfig = {
  'test1': {
    basicName: '',
    parentBasicName: ''
  },
  'test2': {}
}

type MockUseAbilitiesType = keyof typeof MockUseAbilitesTestConfig
const MockUseAbilitesTypes = Object.keys(MockUseAbilitesTestConfig) as MockUseAbilitiesType[]

export const createMockUseAbilitiesData = (type: MockUseAbilitiesType) => {
  return match(type).with('test1', () => ({}))
  .with('test2', () => ({}))
  .otherwise(() => DEFAULT_ABILITIES)
}

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
  describe('matrix', () => {
    it.each(MockUseAbilitesTypes)('', (type, ) => {
      const mockData = createMockUseAbilitiesData(type)
      mockUseAccountSafely.mockReturnValue({ address: createAccounts().getAddress('user') as Address })
      mockUseBasicName.mockReturnValue(createMockBasicNameData(''))
      mockUseResolverIsAuthorised.mockReturnValue({ data: { isAuthorised: true, isValid: true }, isLoading: false, isFetching: false })
      const { result } = renderHook(() => useAbilities({ name: 'test.eth' }))
      expect(result.current.data).toEqual(data)
    })
  })
})
