import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { useExpiryActions } from './useExpiryActions'

vi.mock('wagmi')
const mockUseAccount = mockFunction(useAccount)

vi.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: () => ({
    data: {
      canEdit: true,
    },
    isLoading: false,
  }),
}))

describe('useExpiryActions', () => {
  beforeEach(() => {
    mockUseAccount.mockReset()
    mockUseAccount.mockReturnValue({ address: '0x123', isConnected: true })
  })

  it('should render if expiryDetails contains a expiry type data with a valid expiry date', () => {
    const { result } = renderHook(() =>
      useExpiryActions({
        name: 'test.eth',
        expiryDetails: [{ type: 'expiry', date: new Date('3255803954000') }],
      }),
    )
    expect(result.current).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'extend' })]),
    )
  })

  it('should not show extend action if not logged in', () => {
    mockUseAccount.mockReturnValue({ address: undefined, isConnected: false })
    const { result } = renderHook(() =>
      useExpiryActions({
        name: 'test.eth',
        expiryDetails: [{ type: 'expiry', date: new Date('3255803954000') }],
      }),
    )
    expect(result.current).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'extend' })]),
    )
    expect(result.current).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'set-reminder' })]),
    )
  })

  it('should render null if name is subname and if expiryDetails contains a expiry type data with a valid expiry date', () => {
    const { result } = renderHook(() =>
      useExpiryActions({
        name: 'sub.test.eth',
        expiryDetails: [{ type: 'expiry', date: new Date('3255803954000') }],
      }),
    )
    expect(result.current).toEqual(null)
  })

  it('should return null if expiryDetails contains a expiry type data but an invalid expiry date', () => {
    const { result } = renderHook(() =>
      useExpiryActions({
        name: 'test.eth',
        expiryDetails: [{ type: 'expiry', date: undefined as unknown as Date }],
      }),
    )
    expect(result.current).toEqual(null)
  })

  it('should return null if expiryDetails does not contain a expiry type data', () => {
    const { result } = renderHook(() =>
      useExpiryActions({
        name: 'test.eth',
        expiryDetails: [{ type: 'expiry', date: undefined as unknown as Date }],
      }),
    )
    expect(result.current).toEqual(null)
  })

  it('should show both extend and set-reminder actions if logged in', () => {
    mockUseAccount.mockReturnValue({ address: '0xabc', isConnected: true })
    const { result } = renderHook(() =>
      useExpiryActions({
        name: 'test.eth',
        expiryDetails: [{ type: 'expiry', date: new Date('3255803954000') }],
      }),
    )
    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'extend' }),
        expect.objectContaining({ type: 'set-reminder' }),
      ]),
    )
  })
})
