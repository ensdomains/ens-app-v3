/* eslint-disable @typescript-eslint/naming-convention */
import { match } from 'ts-pattern'

import { makeMockUseExpiryData, MockUseExpiryType } from './makeMockUseExpiryData'
import { makeMockUseOwnerData, MockUseOwnerType } from './makeMockUseOwnerData'
import { makeMockUsePriceData, MockUsePriceType } from './makeMockUsePriceData'
import { makeMockUseValidate, MockUseValidateType } from './makeMockUseValidate'
import { makeMockUseWrapperDataData, MockUseWrapperDataType } from './makeMockUseWrapperDataData.ts'

type MockUseBasicNameConfig = {
  useValidateType: MockUseValidateType
  useOwnerType: MockUseOwnerType
  useWrapperDataType: MockUseWrapperDataType
  useExpiryType: MockUseExpiryType
  usePriceType: MockUsePriceType
}

export const mockUseBasicNameConfig = {
  eth: {
    useValidateType: 'eth',
    useOwnerType: 'eth',
    useWrapperDataType: 'unwrapped-or-available',
    useExpiryType: 'eth',
    usePriceType: 'tld',
  },
  'eth-available-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-available-2ld',
    useWrapperDataType: 'unwrapped-or-available',
    useExpiryType: 'eth-available-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-unwrapped-2ld',
    useWrapperDataType: 'unwrapped-or-available',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-emancipated-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-wrapped-2ld',
    useWrapperDataType: 'eth-emancipated-2ld',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-grace-period-unwrapped-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-grace-period-unwrapped-2ld',
    useWrapperDataType: 'unwrapped-or-available',
    useExpiryType: 'eth-grace-period-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
} as const

type MockUseBasicNameType = keyof typeof mockUseBasicNameConfig

export const mockUseBasicNameTypes = Object.keys(
  mockUseBasicNameConfig,
) as unknown as MockUseBasicNameType[]

export const makeMockUseBasicName = (type: MockUseBasicNameType) => {
  const config = mockUseBasicNameConfig[type]
  const { useValidateType, useOwnerType, useWrapperDataType, useExpiryType, usePriceType } = config
  const expiryData = makeMockUseExpiryData(useExpiryType)
  const expiryDate = expiryData?.expiry?.date
  const gracePeriodEndDate =
    expiryDate && expiryData?.gracePeriod
      ? new Date(expiryDate.getTime() + expiryData.gracePeriod * 1000)
      : undefined

  console.log('priceType', usePriceType)
  const BaseBasicName = {
    ...makeMockUseValidate(useValidateType),
    ownerData: makeMockUseOwnerData(useOwnerType),
    wrapperData: makeMockUseWrapperDataData(useWrapperDataType),
    priceData: makeMockUsePriceData(usePriceType),
    expiryDate,
    gracePeriodEndDate,
  }
  return match(type)
    .with('eth', () => ({
      ...BaseBasicName,
      normalisedName: 'eth',
      truncatedName: 'eth',
      canBeWrapped: false,
      pccExpired: false,
      registrationStatus: 'owned',
      isCachedData: false,
      isLoading: false,
      isWrapped: false,
    }))
    .with('eth-available-2ld', () => ({
      ...BaseBasicName,
      normalisedName: 'eth',
      truncatedName: 'eth',
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: true,
      registrationStatus: 'owned',
      isLoading: false,
      isCachedData: false,
    }))
    .with('eth-unwrapped-2ld', () => ({
      ...BaseBasicName,
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      canBeWrapped: true,
      pccExpired: false,
      registrationStatus: 'registered',
      isCachedData: false,
      isLoading: false,
      isWrapped: false,
    }))
    .with('eth-emancipated-2ld', () => ({
      ...BaseBasicName,
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      isWrapped: true,
      pccExpired: false,
      canBeWrapped: false,
      registrationStatus: 'registered',
      isLoading: false,
      isCachedData: false,
    }))
    .with('eth-grace-period-unwrapped-2ld', () => ({
      ...BaseBasicName,
      ownerData: makeMockUseOwnerData('eth-grace-period-unwrapped-2ld-with-registry-registrant'),
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      registrationStatus: 'gracePeriod',
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: true,
      isLoading: false,
      isCachedData: false,
    }))
    .exhaustive()
}
