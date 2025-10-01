import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDnsOwner } from './ensjs/dns/useDnsOwner'
import { useBasicName } from './useBasicName'
import { useNameDetails } from './useNameDetails'
import { useProfile } from './useProfile'

vi.mock('./useBasicName')
vi.mock('./useProfile')
vi.mock('./ensjs/dns/useDnsOwner')

const mockUseBasicName = mockFunction(useBasicName)
const mockUseProfile = mockFunction(useProfile)
const mockUseDnsOwner = mockFunction(useDnsOwner)

describe('useNameDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    mockUseDnsOwner.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
  })
  it('should return an error message for an invalid name', () => {
    mockUseBasicName.mockReturnValue({
      isValid: false,
      name: 'invalid',
    })

    const { result } = renderHook(() => useNameDetails({ name: 'invalid' }))
    expect(result.current.error).toEqual(expect.objectContaining({ content: 'errors.invalidName' }))
  })
  it('should not enable useProfile when normalisedName is [root]', () => {
    mockUseBasicName.mockReturnValue({
      isValid: true,
      name: '[root]',
      normalisedName: '[root]',
    })
    renderHook(() => useNameDetails({ name: '[root]' }))
    expect(mockUseProfile).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }))
  })
})
