import { mockFunction, renderHook } from '@app/test-utils'

import { BigNumber } from 'ethers'

import { useEns } from '@app/utils/EnsProvider'

import { useRegistrationStatus } from './useRegistrationStatus'

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)

const mockGetExpiry = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetPrice = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetOwner = jest.fn()
const mockBatch = jest.fn()

describe('useRegistrationStatus', () => {
  mockUseEns.mockReturnValue({
    ready: true,
    getExpiry: mockGetExpiry,
    getPrice: mockGetPrice,
    getOwner: mockGetOwner,
    batch: mockBatch,
  })
  describe('2LD .eth', () => {
    it('should return short if a name is less than 3 characters', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('12.eth'))
      await waitForNextUpdate()

      expect(result.current.data).toBe('short')
    })
    it("should return invalid if batch call doesn't return", async () => {
      mockBatch.mockResolvedValue(null)

      const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('test.eth'))
      await waitForNextUpdate()

      expect(result.current.data).toBe('invalid')
    })
    it('should return registered if expiry is in the future', async () => {
      mockBatch.mockImplementation((...args) => args)
      mockGetExpiry.batch.mockReturnValue({
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        gracePeriod: 60 * 60 * 24 * 1000,
      })
      mockGetPrice.batch.mockReturnValue({})

      const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('test.eth'))
      await waitForNextUpdate()

      expect(result.current.data).toBe('registered')
    })
    it('should return grace period if expiry is in the past, but within grace period', async () => {
      mockBatch.mockImplementation((...args) => args)
      mockGetExpiry.batch.mockReturnValue({
        expiry: new Date(Date.now() - 1000),
        gracePeriod: 60 * 60 * 24 * 1000,
      })
      mockGetPrice.batch.mockReturnValue({})

      const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('test.eth'))
      await waitForNextUpdate()

      expect(result.current.data).toBe('gracePeriod')
    })
    it('should return premium if premium is greater than 0', async () => {
      mockBatch.mockImplementation((...args) => args)
      mockGetExpiry.batch.mockReturnValue({
        expiry: new Date(Date.now() - 1000),
        gracePeriod: 0,
      })
      mockGetPrice.batch.mockReturnValue({
        premium: BigNumber.from(1),
      })

      const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('test.eth'))
      await waitForNextUpdate()

      expect(result.current.data).toBe('premium')
    })
    it('should otherwise return available', async () => {
      mockBatch.mockImplementation((...args) => args)
      mockGetExpiry.batch.mockReturnValue({
        expiry: new Date(Date.now() - 1000),
        gracePeriod: 0,
      })
      mockGetPrice.batch.mockReturnValue({
        premium: BigNumber.from(0),
      })

      const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('test.eth'))
      await waitForNextUpdate()

      expect(result.current.data).toBe('available')
    })
  })
  it('should return registered if name has an owner', async () => {
    mockGetOwner.mockResolvedValue({
      owner: '0x123',
    })

    const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('example.com'))
    await waitForNextUpdate()

    expect(result.current.data).toBe('registered')
  })
  it('should return not owned if name has no owner, and has more than 2 labels', async () => {
    mockGetOwner.mockResolvedValue(undefined)

    const { result, waitForNextUpdate } = renderHook(() =>
      useRegistrationStatus('test.example.com'),
    )
    await waitForNextUpdate()

    expect(result.current.data).toBe('notOwned')
  })
  it('should return not imported otherwise', async () => {
    mockGetOwner.mockResolvedValue(undefined)

    const { result, waitForNextUpdate } = renderHook(() => useRegistrationStatus('example.com'))
    await waitForNextUpdate()

    expect(result.current.data).toBe('notImported')
  })
})
