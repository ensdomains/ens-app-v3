import { mockFunction, renderHook } from '@app/test-utils'

import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { createDateAndValue } from '@app/utils/utils'

import { useContractAddress } from './chain/useContractAddress'
import useCurrentBlockTimestamp from './chain/useCurrentBlockTimestamp'
import { useExpiry } from './ensjs/public/useExpiry'
import { useOwner } from './ensjs/public/useOwner'
import { usePrice } from './ensjs/public/usePrice'
import { useWrapperData } from './ensjs/public/useWrapperData'
import { useBasicName } from './useBasicName'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'

jest.mock('./chain/useCurrentBlockTimestamp')
jest.mock('./chain/useContractAddress')
jest.mock('./useValidate')
jest.mock('./useSupportsTLD')
jest.mock('@app/utils/registrationStatus')

jest.mock('./ensjs/public/useOwner')
jest.mock('./ensjs/public/useExpiry')
jest.mock('./ensjs/public/useWrapperData')
jest.mock('./ensjs/public/usePrice')

const mockUseValidate = mockFunction(useValidate)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseSupportsTLD = mockFunction(useSupportsTLD)
const mockUseCurrentBlockTimestamp = mockFunction(useCurrentBlockTimestamp)
const mockGetRegistrationStatus = mockFunction(getRegistrationStatus)

const mockUseOwner = mockFunction(useOwner)
const mockUseExpiry = mockFunction(useExpiry)
const mockUseWrapperData = mockFunction(useWrapperData)
const mockUsePrice = mockFunction(usePrice)

describe('useBasicName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSupportsTLD.mockReturnValue({ data: true, isLoading: false })
    mockUseOwner.mockReturnValue({ data: undefined, isLoading: false })
    mockUseExpiry.mockReturnValue({ data: undefined, isLoading: false })
    mockUseWrapperData.mockReturnValue({ data: undefined, isLoading: false })
    mockUsePrice.mockReturnValue({ data: undefined, isLoading: false })
    mockUseContractAddress.mockReturnValue('0x123')
  })
  describe('2LD .eth', () => {
    beforeEach(() => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
    })
    it('should query for the owner', () => {
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUseOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the wrapper data', () => {
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUseWrapperData).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the expiry', () => {
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUseExpiry).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the price', () => {
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUsePrice).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
  })
  describe('DNS', () => {
    beforeEach(() => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: false,
        isShort: false,
        name: 'test.com',
        labelCount: 2,
      })
    })
    it('should query for the owner', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUseOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the wrapper data', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUseWrapperData).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should not query for the expiry', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUseExpiry).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
    it('should not query for the price', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUsePrice).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
  })
  describe('[root]', () => {
    beforeEach(() => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        name: '[root]',
        labelCount: 1,
      })
    })
    it('should query for the owner', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUseOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should not query for wrapper data', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUseWrapperData).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
    it('should not query for the expiry', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUseExpiry).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
    it('should not query for the price', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUsePrice).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
  })
  describe('expiry poll', () => {
    const gracePeriodSeconds = 60 * 60 * 24 * 90 // 90 days
    const ms5Minutes = 1_000 * 60 * 5
    it('should enable useCurrentBlockTimestamp when a grace period ends in less than 5 minutes', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now() - (gracePeriodSeconds * 1000) + ms5Minutes - 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: true })
    })
    it('should enable useCurrentBlockTimestamp when a grace period ended less than 5 minutes ago', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now() - (gracePeriodSeconds * 1000) - ms5Minutes + 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: true })
    })
    it('should not enable useCurrentBlockTimestamp when a grace period ends in more than 5 minutes', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now() - gracePeriodSeconds + ms5Minutes + 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should not enable useCurrentBlockTimestamp when a grace period ended more than 5 minutes ago', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now() - gracePeriodSeconds - ms5Minutes - 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should not enable useCurrentBlockTimestamp when name does not have a grace period (not 2ld .eth)', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: false,
        isETH: true,
        isShort: false,
        name: 'abc.test.eth',
        labelCount: 3,
      })
      mockUseOwner.mockReturnValue({
        data: {
          owner: '0x123',
          ownershipLevel: 'nameWrapper',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now())),
          gracePeriod: undefined,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: 'abc.test.eth' }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should pass browser timestamp to getRegistrationStatus when isTempPremiumDesynced is false', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: false,
        isETH: true,
        isShort: false,
        name: 'abc123.test.eth',
        labelCount: 3,
      })
      mockUseOwner.mockReturnValue({
        data: {
          owner: '0x123',
          ownershipLevel: 'nameWrapper',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now())),
          gracePeriod: undefined,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      jest.spyOn(Date, 'now').mockReturnValue(1234567890)
      renderHook(() => useBasicName({ name: 'abc123.test.eth' }))
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1234567890 }),
      )
    })
    it('should pass block timestamp to getRegistrationStatus when isTempPremiumDesynced is true and data is returned from useCurrentBlockTimestamp', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now() - (gracePeriodSeconds * 1000) + ms5Minutes - 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      mockUseCurrentBlockTimestamp.mockReturnValue(1n)
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1000 }),
      )
    })
    it('should pass delayed browser timestamp when isTempPremiumDesynced is true and data is not returned from useCurrentBlockTimestamp', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isETH: true,
        isShort: false,
        name: 'test.eth',
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(1234567890 - (gracePeriodSeconds * 1000) + ms5Minutes - 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      jest.spyOn(Date, 'now').mockReturnValue(1234567890)
      mockUseCurrentBlockTimestamp.mockReturnValue(undefined)
      renderHook(() => useBasicName({ name: 'test.eth' }))
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1234567890 - ms5Minutes }),
      )
    })
  })
})
