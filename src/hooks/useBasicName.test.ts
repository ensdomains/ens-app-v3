import { mockFunction, renderHook } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { useBasicName } from './useBasicName'
import { useValidate } from './useValidate'

jest.mock('@app/utils/EnsProvider')
jest.mock('./useValidate')

const mockUseEns = mockFunction(useEns)
const mockUseValidate = mockFunction(useValidate)

const mockGetOwner = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetExpiry = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetPrice = {
  ...jest.fn(),
  batch: jest.fn(),
}

const mockBatch = jest.fn()

describe('useBasicName', () => {
  mockUseEns.mockReturnValue({
    ready: true,
    getOwner: mockGetOwner,
    getExpiry: mockGetExpiry,
    getPrice: mockGetPrice,
    batch: mockBatch,
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should query for the expiry if the name is a 2LD .eth', () => {
    mockUseValidate.mockReturnValue({
      valid: true,
      name: 'test.eth',
      labelCount: 2,
    })

    renderHook(() => useBasicName('test.eth'))
    expect(mockBatch).toHaveBeenCalled()
    expect(mockGetExpiry.batch).toHaveBeenCalled()
  })
  it('should not query for the expiry if not a 2LD .eth', () => {
    mockUseValidate.mockReturnValue({
      valid: true,
      name: 'test.com',
      labelCount: 2,
    })

    renderHook(() => useBasicName('test.com'))
    expect(mockGetExpiry.batch).not.toHaveBeenCalled()
  })
})
