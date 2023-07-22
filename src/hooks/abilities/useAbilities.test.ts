import { renderHook } from '@app/test-utils'

import { useAbilities } from './useAbilities'

jest.mock('@app/hooks/useAccountSafely', () => ({
  useAccountSafely: () => ({ address: '0x123' }),
}))

const mockUseBasicName = jest.fn()
jest.mock('@app/hooks/useBasicName', () => ({
  useBasicName: () => mockUseBasicName(),
}))

const mockUseResolverIsAuthorized = jest.fn()
jest.mock('@app/hooks/resolver/useResolverIsAuthorized', () => ({
  useResolverIsAuthorized: () => mockUseResolverIsAuthorized(),
}))

const mockUseHasSubnames = jest.fn()
jest.mock('@app/hooks/useHasSubnames', () => ({
  useHasSubnames: () => mockUseHasSubnames(),
}))

describe('useAbilities', () => {
  describe('basic abilities', () => {
    const name = 'nick.eth'
    const ownerAddress = '0x123'
    const account = ownerAddress

    it('should return false for all send abilities if CANNOT_TRANSFER has been burned', () => {
      mockUseBasicName.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
          owner: account,
        },
        wrapperData: {
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_TRANSFER: true,
          },
        },
      })
      mockUseResolverIsAuthorized.mockReturnValue({ data: { isAuthorized: true, isValid: true } })
      mockUseHasSubnames.mockReturnValue({ hasSubnames: false, isLoading: false })
      const { result } = renderHook(() => useAbilities(name))
      expect(result.current.data?.canSend).toBe(false)
    })
    it('should return canEditRecords as true if resolver is authorised', () => {
      mockUseBasicName.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
          owner: account,
        },
        wrapperData: {
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_SET_RESOLVER: true,
          },
        },
      })
      mockUseResolverIsAuthorized.mockReturnValue({ data: { isAuthorized: true, isValid: true } })
      mockUseHasSubnames.mockReturnValue({ hasSubnames: false, isLoading: false })

      const { result } = renderHook(() => useAbilities(name))

      expect(result.current.data?.canEditRecords).toBe(true)
    })
  })
})
