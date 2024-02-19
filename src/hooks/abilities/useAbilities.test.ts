import { mockFunction, renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useAccountSafely } from '../account/useAccountSafely'
import { useResolverIsAuthorised } from '../resolver/useResolverIsAuthorised'
import { useBasicName } from '../useBasicName'
import { useHasSubnames } from '../useHasSubnames'
import { useAbilities } from './useAbilities'

vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/resolver/useResolverIsAuthorised')
vi.mock('@app/hooks/useHasSubnames')

const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseBasicName = mockFunction(useBasicName)
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
})
