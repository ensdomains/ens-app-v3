/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

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
  'eth-unwrapped-2ld:owner': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-unwrapped-2ld:owner',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld:manager': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-unwrapped-2ld:manager',
    useWrapperDataType: 'unwrapped-or-available',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-unwrapped-2ld:unowned',
    useWrapperDataType: 'unwrapped-or-available',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-emancipated-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-wrapped-2ld',
    useWrapperDataType: 'emancipated',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-emancipated-2ld:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:unowned',
    useWrapperDataType: 'emancipated:unowned',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-locked-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'eth-wrapped-2ld',
    useWrapperDataType: 'eth-locked-2ld',
    useExpiryType: 'eth-registered-2ld',
    usePriceType: 'eth-available-normal-2ld',
  } as MockUseBasicNameConfig,
  'eth-burnt-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'burnt',
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
  'eth-unwrapped-subname': {
    useValidateType: 'valid-subname',
    useOwnerType: 'eth-unwrapped-subname',
    useExpiryType: 'undefined',
    usePriceType: 'undefined',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-subname:unowned': {
    useValidateType: 'valid-subname',
    useOwnerType: 'eth-unwrapped-subname:unowned',
    useExpiryType: 'undefined',
    usePriceType: 'undefined',
  } as MockUseBasicNameConfig,
  'eth-wrapped-subname': {
    useValidateType: 'valid-subname',
    useOwnerType: 'eth-wrapped-subname',
    useWrapperDataType: 'wrapped',
    useExpiryType: 'undefined',
    usePriceType: 'undefined',
  } as MockUseBasicNameConfig,
  'eth-wrapped-subname:unowned': {
    useValidateType: 'valid-subname',
    useOwnerType: 'eth-wrapped-subname:unowned',
    useWrapperDataType: 'wrapped:unowned',
    useExpiryType: 'undefined',
    usePriceType: 'undefined',
  } as MockUseBasicNameConfig,
  'eth-emancipated-subname': {
    useValidateType: 'valid-subname',
    useOwnerType: 'eth-wrapped-subname',
    useWrapperDataType: 'emancipated',
    useExpiryType: 'undefined',
    usePriceType: 'undefined',
  } as MockUseBasicNameConfig,
  'eth-emancipated-subname:unowned': {
    useValidateType: 'valid-subname',
    useOwnerType: 'eth-wrapped-subname:unowned',
    useWrapperDataType: 'emancipated:unowned',
    useExpiryType: 'undefined',
    usePriceType: 'undefined',
  } as MockUseBasicNameConfig,
  'dns-offchain-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: undefined,
    useWrapperDataType: undefined,
    useExpiryType: undefined,
    usePriceType: undefined,
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
      registrationStatus: 'owned' as const,
      isCachedData: false,
      isLoading: false,
      isWrapped: false,
    }))
    .with('eth-available-2ld', () => ({
      ...BaseBasicName,
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: true,
      registrationStatus: 'available' as const,
      isLoading: false,
      isCachedData: false,
    }))
    .with(
      P.union(
        'eth-unwrapped-2ld',
        'eth-unwrapped-2ld:manager',
        'eth-unwrapped-2ld:owner',
        'eth-unwrapped-2ld:unowned',
      ),
      () => ({
        ...BaseBasicName,
        normalisedName: 'name.eth',
        truncatedName: 'name.eth',
        canBeWrapped: true,
        pccExpired: false,
        registrationStatus: 'registered' as const,
        isCachedData: false,
        isLoading: false,
        isWrapped: false,
      }),
    )
    .with(P.union('eth-emancipated-2ld', 'eth-emancipated-2ld:unowned'), () => ({
      ...BaseBasicName,
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      isWrapped: true,
      pccExpired: false,
      canBeWrapped: false,
      registrationStatus: 'registered' as const,
      isLoading: false,
      isCachedData: false,
    }))
    .with(P.union('eth-locked-2ld', 'eth-burnt-2ld'), () => ({
      ...BaseBasicName,
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      isWrapped: true,
      pccExpired: false,
      canBeWrapped: false,
      registrationStatus: 'registered' as const,
      isLoading: false,
      isCachedData: false,
    }))
    .with('eth-grace-period-unwrapped-2ld', () => ({
      ...BaseBasicName,
      ownerData: makeMockUseOwnerData('eth-grace-period-unwrapped-2ld-with-registry-registrant'),
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      registrationStatus: 'gracePeriod' as const,
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: true,
      isLoading: false,
      isCachedData: false,
    }))
    .with(P.union('eth-unwrapped-subname', 'eth-unwrapped-subname:unowned'), () => ({
      ...BaseBasicName,
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      registrationStatus: 'owned' as const,
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: true,
      isLoading: false,
      isCachedData: false,
    }))
    .with(
      P.union(
        'eth-wrapped-subname',
        'eth-wrapped-subname:unowned',
        'eth-emancipated-subname',
        'eth-emancipated-subname:unowned',
      ),
      () => ({
        ...BaseBasicName,
        normalisedName: 'subname.name.eth',
        truncatedName: 'subname.name.eth',
        registrationStatus: 'owned' as const,
        isWrapped: true,
        pccExpired: false,
        canBeWrapped: false,
        isLoading: false,
        isCachedData: false,
      }),
    )
    .exhaustive()
}
