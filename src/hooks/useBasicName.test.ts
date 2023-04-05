import { mockFunction, renderHook } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { useBasicName } from './useBasicName'
import { useContractAddress } from './useContractAddress'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'

jest.mock('@app/utils/EnsProvider')
jest.mock('./useValidate')
jest.mock('./useContractAddress')
jest.mock('./useSupportsTLD')

const mockUseEns = mockFunction(useEns)
const mockUseValidate = mockFunction(useValidate)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseSupportsTLD = mockFunction(useSupportsTLD)

const mockGetOwner = {
  batch: jest.fn(),
}
const mockGetExpiry = {
  batch: jest.fn(),
}
const mockGetPrice = {
  batch: jest.fn(),
}
const mockGetWrapperData = {
  batch: jest.fn(),
}

const mockBatch = jest.fn()

const mockUseEnsValue = {
  ready: true,
  getOwner: mockGetOwner,
  getExpiry: mockGetExpiry,
  getPrice: mockGetPrice,
  getWrapperData: mockGetWrapperData,
  batch: mockBatch,
}

describe('useBasicName', () => {
  mockUseSupportsTLD.mockReturnValue({ data: true, isLoading: false })
  mockUseEns.mockReturnValue(mockUseEnsValue)
  mockUseContractAddress.mockReturnValue('0x123')
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should query for the expiry if the name is a 2LD .eth', async () => {
    mockUseValidate.mockReturnValue({
      isValid: true,
      is2LD: true,
      isETH: true,
      isShort: false,
      name: 'test.eth',
      labelCount: 2,
    })

    const { waitForNextUpdate } = renderHook(() => useBasicName('test.eth'))
    await waitForNextUpdate()
    expect(mockGetExpiry.batch).toHaveBeenCalled()
  })
  it('should not query for the expiry if not a 2LD .eth', async () => {
    mockUseValidate.mockReturnValue({
      isValid: true,
      is2LD: true,
      isETH: false,
      isShort: false,
      name: 'test.com',
      labelCount: 2,
    })

    const { waitForNextUpdate } = renderHook(() => useBasicName('test.com'))
    await waitForNextUpdate()
    expect(mockGetExpiry.batch).not.toHaveBeenCalled()
  })
  it('should not query for the expiry if is [root]', async () => {
    const mockGetOwnerNoBatch = jest.fn()
    mockUseEns.mockReturnValue({
      ...mockUseEnsValue,
      getOwner: mockGetOwnerNoBatch,
    })
    mockUseValidate.mockReturnValue({
      isValid: true,
      name: '[root]',
      labelCount: 1,
    })

    const { waitForNextUpdate } = renderHook(() => useBasicName('[root]'))
    await waitForNextUpdate()
    expect(mockGetExpiry.batch).not.toHaveBeenCalled()
    expect(mockGetOwnerNoBatch).toHaveBeenCalled()
  })
})
