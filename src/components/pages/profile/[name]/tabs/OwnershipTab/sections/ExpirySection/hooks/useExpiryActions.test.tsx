import { renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useExpiryActions } from './useExpiryActions'

vi.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: () => ({
    data: {
      canEdit: true,
    },
    isLoading: false,
  }),
}))

describe('useExpiryActions', () => {
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
})
