import { mockFunction, renderHook } from '@app/test-utils'

import { useDnsOwner } from './ensjs/dns/useDnsOwner'
import { useBasicName } from './useBasicName'
import { useNameDetails } from './useNameDetails'
import { useProfile } from './useProfile'

jest.mock('./useBasicName')
jest.mock('./useProfile')
jest.mock('./ensjs/dns/useDnsOwner')

const mockUseBasicName = mockFunction(useBasicName)
const mockUseProfile = mockFunction(useProfile)
const mockUseDnsOwner = mockFunction(useDnsOwner)

describe('useNameDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
    expect(result.current.error).toEqual('errors.invalidName')
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
