import { mockFunction, renderHook } from '@app/test-utils'
import { useEns } from '@app/utils/EnsProvider'
import { useNameDetails } from './useNameDetails'
import { useProfile } from './useProfile'
import { useRegistrationStatus } from './useRegistrationStatus'
import { useValidate } from './useValidate'

jest.mock('@app/utils/EnsProvider')
jest.mock('./useProfile')
jest.mock('./useRegistrationStatus')
jest.mock('./useValidate')

const mockUseEns = mockFunction(useEns)
const mockUseProfile = mockFunction(useProfile)
const mockUseRegistrationStatus = mockFunction(useRegistrationStatus)
const mockUseValidate = mockFunction(useValidate)

const mockGetOwner = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetExpiry = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockBatch = jest.fn()

describe('useNameDetails', () => {
  mockUseEns.mockReturnValue({
    ready: true,
    getOwner: mockGetOwner,
    getExpiry: mockGetExpiry,
    batch: mockBatch,
  })
  mockUseProfile.mockReturnValue({
    loading: false,
    profile: undefined,
    status: 'success',
  })
  mockUseRegistrationStatus.mockReturnValue({
    data: undefined,
    isLoading: false,
    status: 'success',
  })
  it('should return an error message for an invalid name', () => {
    mockUseValidate.mockReturnValue({
      valid: false,
      name: 'invalid',
    })

    const { result } = renderHook(() => useNameDetails('invalid'))
    expect(result.current.error).toEqual('This name is invalid.')
  })
  it('should query for the expiry if the name is a 2LD .eth', () => {
    mockUseValidate.mockReturnValue({
      valid: true,
      name: 'test.eth',
      labelCount: 2,
    })

    renderHook(() => useNameDetails('test.eth'))

    expect(mockBatch).toHaveBeenCalled()
    expect(mockGetExpiry.batch).toHaveBeenCalled()
  })
  it('should not query for the expiry if not a 2LD .eth', () => {
    mockUseValidate.mockReturnValue({
      valid: true,
      name: 'test.com',
      labelCount: 2,
    })

    renderHook(() => useNameDetails('test.com'))

    expect(mockGetExpiry.batch).not.toHaveBeenCalled()
  })
})
