import { mockFunction, renderHook } from '@app/test-utils'

import { BigNumber } from '@ethersproject/bignumber'

import { useEns } from '@app/utils/EnsProvider'
import { getRegistrationStatus } from '@app/utils/registrationStatus'

import { useBasicName } from './useBasicName'
import { useContractAddress } from './useContractAddress'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'

jest.mock('@app/utils/EnsProvider')
jest.mock('./useValidate')
jest.mock('./useContractAddress')
jest.mock('./useSupportsTLD')
jest.mock('./useCurrentBlockTimestamp')
jest.mock('@app/utils/registrationStatus')

const mockUseEns = mockFunction(useEns)
const mockUseValidate = mockFunction(useValidate)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseSupportsTLD = mockFunction(useSupportsTLD)
const mockUseCurrentBlockTimestamp = mockFunction(useCurrentBlockTimestamp)
const mockGetRegistrationStatus = mockFunction(getRegistrationStatus)

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
  beforeEach(() => {
    mockUseSupportsTLD.mockReturnValue({ data: true, isLoading: false })
    mockUseEns.mockReturnValue(mockUseEnsValue)
    mockUseContractAddress.mockReturnValue('0x123')
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
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
  describe('expiry poll', () => {
    const gracePeriodMs = 1_000 * 60 * 60 * 24 * 90 // 90 days
    const ms5Minutes = 1_000 * 60 * 5
    it('should enable useCurrentBlockTimestamp when a grace period ends in less than 5 minutes', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockBatch.mockResolvedValue([
        {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        undefined,
        {
          expiry: new Date(Date.now() - gracePeriodMs + ms5Minutes - 1000),
          gracePeriod: gracePeriodMs,
        },
        {
          base: BigNumber.from(0),
          premium: BigNumber.from(0),
        },
      ])
      const { waitForNextUpdate } = renderHook(() => useBasicName('test.eth'))
      await waitForNextUpdate()
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: true })
    })
    it('should enable useCurrentBlockTimestamp when a grace period ended less than 5 minutes ago', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockBatch.mockResolvedValue([
        {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        undefined,
        {
          expiry: new Date(Date.now() - gracePeriodMs - ms5Minutes - 1000),
          gracePeriod: gracePeriodMs,
        },
        {
          base: BigNumber.from(0),
          premium: BigNumber.from(0),
        },
      ])
      const { waitForNextUpdate } = renderHook(() => useBasicName('test.eth'))
      await waitForNextUpdate()
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: true })
    })
    it('should not enable useCurrentBlockTimestamp when a grace period ends in more than 5 minutes', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockBatch.mockResolvedValue([
        {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        undefined,
        {
          expiry: new Date(Date.now() - gracePeriodMs + ms5Minutes + 1000),
          gracePeriod: gracePeriodMs,
        },
        {
          base: BigNumber.from(0),
          premium: BigNumber.from(0),
        },
      ])
      const { waitForNextUpdate } = renderHook(() => useBasicName('test.eth'))
      await waitForNextUpdate()
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should not enable useCurrentBlockTimestamp when a grace period ended more than 5 minutes ago', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockBatch.mockResolvedValue([
        {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        undefined,
        {
          expiry: new Date(Date.now() - gracePeriodMs - ms5Minutes + 1000),
          gracePeriod: gracePeriodMs,
        },
        {
          base: BigNumber.from(0),
          premium: BigNumber.from(0),
        },
      ])
      const { waitForNextUpdate } = renderHook(() => useBasicName('test.eth'))
      await waitForNextUpdate()
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should not enable useCurrentBlockTimestamp when name does not have a grace period (not 2ld .eth)', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: false,
        isETH: true,
        isShort: false,
        name: 'abc.test.eth',
        labelCount: 3,
      })
      mockBatch.mockResolvedValue([
        {
          owner: '0x123',
          ownershipLevel: 'nameWrapper',
        },
        undefined,
        {
          expiry: new Date(),
          gracePeriod: null,
        },
        undefined,
      ])
      const { waitForNextUpdate } = renderHook(() => useBasicName('abc.test.eth'))
      await waitForNextUpdate()
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should pass browser timestamp to getRegistrationStatus when isTempPremiumDesynced is false', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: false,
        isETH: true,
        isShort: false,
        name: 'abc123.test.eth',
        labelCount: 3,
      })
      mockBatch.mockResolvedValue([
        {
          owner: '0x123',
          ownershipLevel: 'nameWrapper',
        },
        undefined,
        {
          expiry: new Date(),
          gracePeriod: null,
        },
        undefined,
      ])
      jest.spyOn(Date, 'now').mockReturnValue(1234567890)
      const { waitForNextUpdate } = renderHook(() => useBasicName('abc123.test.eth'))
      await waitForNextUpdate()
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1234567890 }),
      )
    })
    it('should pass block timestamp to getRegistrationStatus when isTempPremiumDesynced is true and data is returned from useCurrentBlockTimestamp', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockBatch.mockResolvedValue([
        {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        undefined,
        {
          expiry: new Date(Date.now() - gracePeriodMs + ms5Minutes - 1000),
          gracePeriod: gracePeriodMs,
        },
        {
          base: BigNumber.from(0),
          premium: BigNumber.from(0),
        },
      ])
      mockUseCurrentBlockTimestamp.mockReturnValue(1)
      const { waitForNextUpdate } = renderHook(() => useBasicName('test.eth'))
      await waitForNextUpdate()
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1000 }),
      )
    })
    it('should pass delayed browser timestamp when isTempPremiumDesynced is true and data is not returned from useCurrentBlockTimestamp', async () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test1.eth',
        labelCount: 2,
      })
      mockBatch.mockResolvedValue([
        {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        undefined,
        {
          expiry: new Date(Date.now() - gracePeriodMs + ms5Minutes - 1000),
          gracePeriod: gracePeriodMs,
        },
        {
          base: BigNumber.from(0),
          premium: BigNumber.from(0),
        },
      ])
      jest.spyOn(Date, 'now').mockReturnValue(1234567890)
      mockUseCurrentBlockTimestamp.mockReturnValue(undefined)
      const { waitForNextUpdate } = renderHook(() => useBasicName('test1.eth'))
      await waitForNextUpdate()
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1234567890 }),
      )
    })
  })
})
