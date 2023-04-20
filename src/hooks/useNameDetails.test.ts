import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { useContractAddress } from './useContractAddress'
import { useNameDetails } from './useNameDetails'
import { useProfile } from './useProfile'
import { useValidate } from './useValidate'

jest.mock('@app/utils/EnsProvider')
jest.mock('./useProfile')
jest.mock('./useValidate')
jest.mock('./useContractAddress')

const mockUseEns = mockFunction(useEns)
const mockUseProfile = mockFunction(useProfile)
const mockUseValidate = mockFunction(useValidate)
const mockUseContractAddress = mockFunction(useContractAddress)

const mockGetOwner = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetExpiry = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockBatch = jest.fn()
const mockGetDNSOwner = jest.fn(
  () =>
    new Promise((resolve) => {
      resolve('0xaddress')
    }),
)

describe('useNameDetails', () => {
  mockUseEns.mockReturnValue({
    ready: true,
    getOwner: mockGetOwner,
    getExpiry: mockGetExpiry,
    getDNSOwner: mockGetDNSOwner,
    batch: mockBatch,
  })
  mockUseProfile.mockReturnValue({
    loading: false,
    profile: undefined,
    status: 'success',
  })
  mockUseContractAddress.mockReturnValue('0x123')
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return an error message for an invalid name', () => {
    mockUseValidate.mockReturnValue({
      isValid: false,
      name: 'invalid',
    })

    const { result } = renderHook(() => useNameDetails('invalid'))
    expect(result.current.error).toEqual('errors.invalidName')
  })
  it('should call getDNSOwner if TLD is not .eth', () => {
    mockUseValidate.mockReturnValue({
      isValid: true,
      name: 'test.com',
      labelCount: 2,
    })

    renderHook(() => useNameDetails('test.com'))
    expect(mockGetDNSOwner).toHaveBeenCalledWith('test.com')
  })
  it('should return dnsOwner if TLD is not .eth and there is an owner', async () => {
    mockUseValidate.mockReturnValue({
      isValid: true,
      name: 'test.com',
      labelCount: 2,
    })

    const { result } = renderHook(() => useNameDetails('test.com'))
    await waitFor(() => expect(result.current.dnsOwner).toEqual('0xaddress'))
  })
})
