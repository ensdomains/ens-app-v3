/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

import { MockUseAddrRecordType } from './makeMockUseAddrRecordData'
import { makeMockUseExpiryData, MockUseExpiryType } from './makeMockUseExpiryData'
import { makeMockUseOwnerData, MockUseOwnerType } from './makeMockUseOwnerData'
import { makeMockUsePriceData, MockUsePriceType } from './makeMockUsePriceData'
import { MockUseSubgraphRegistrantType } from './makeMockUseSubgraphRegistrantData'
import { makeMockUseValidate, MockUseValidateType } from './makeMockUseValidate'
import { makeMockUseWrapperDataData, MockUseWrapperDataType } from './makeMockUseWrapperDataData.ts'

type MockUseBasicNameConfig = {
  useValidateType: MockUseValidateType
  useOwnerType: MockUseOwnerType
  useWrapperDataType: MockUseWrapperDataType
  useExpiryType: MockUseExpiryType
  usePriceType: MockUsePriceType
  useAddrRecordType: MockUseAddrRecordType
  useSubgraphRegistrantType: MockUseSubgraphRegistrantType
}

export const mockUseBasicNameConfig = {
  eth: {
    useValidateType: 'eth',
    useOwnerType: 'eth',
    useExpiryType: 'eth',
    usePriceType: 'tld',
  } as MockUseBasicNameConfig,
  // 2LD
  'eth-available-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'registrar:available',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'registrar',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld:owner': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'registrar:owner',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld:manager': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'registrar:manager',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'registrar:unowned',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld:grace-period': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'registrar:grace-period',
    useExpiryType: 'grace-period',
    usePriceType: 'base',
    useSubgraphRegistrantType: 'owned',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-2ld:grace-period:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'registrar:grace-period:unowned',
    useExpiryType: 'grace-period',
    usePriceType: 'base',
    useSubgraphRegistrantType: 'unowned',
  } as MockUseBasicNameConfig,
  'eth-emancipated-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'emancipated',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-emancipated-2ld:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:unowned',
    useWrapperDataType: 'emancipated:unowned',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-emancipated-2ld:grace-period': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:grace-period',
    useWrapperDataType: 'emancipated',
    useExpiryType: 'grace-period',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-emancipated-2ld:grace-period:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:grace-period',
    useWrapperDataType: 'emancipated:unowned',
    useExpiryType: 'grace-period',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-locked-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'locked',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-locked-2ld:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:unowned',
    useWrapperDataType: 'locked:unowned',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-locked-2ld:grace-period': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:grace-period',
    useWrapperDataType: 'locked',
    useExpiryType: 'grace-period',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-locked-2ld:grace-period:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:grace-period',
    useWrapperDataType: 'locked:unowned',
    useExpiryType: 'grace-period',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-burnt-2ld': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'burnt',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  'eth-burnt-2ld:unowned': {
    useValidateType: 'valid-2ld',
    useOwnerType: 'namewrapper:unowned',
    useWrapperDataType: 'burnt:unowned',
    useExpiryType: 'active',
    usePriceType: 'base',
  } as MockUseBasicNameConfig,
  // Subname
  'eth-unwrapped-subname': {
    useValidateType: 'valid-subname',
    useOwnerType: 'registry',
  } as MockUseBasicNameConfig,
  'eth-unwrapped-subname:unowned': {
    useValidateType: 'valid-subname',
    useOwnerType: 'registry:unowned',
  } as MockUseBasicNameConfig,
  'eth-wrapped-subname': {
    useValidateType: 'valid-subname',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'wrapped',
  } as MockUseBasicNameConfig,
  'eth-wrapped-subname:unowned': {
    useValidateType: 'valid-subname',
    useOwnerType: 'namewrapper:unowned',
    useWrapperDataType: 'wrapped:unowned',
  } as MockUseBasicNameConfig,
  'eth-emancipated-subname': {
    useValidateType: 'valid-subname',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'emancipated',
  } as MockUseBasicNameConfig,
  'eth-emancipated-subname:unowned': {
    useValidateType: 'valid-subname',
    useOwnerType: 'namewrapper:unowned',
    useWrapperDataType: 'emancipated:unowned',
  } as MockUseBasicNameConfig,
  'eth-locked-subname': {
    useValidateType: 'valid-subname',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'locked',
  } as MockUseBasicNameConfig,
  'eth-locked-subname:unowned': {
    useValidateType: 'valid-subname',
    useOwnerType: 'namewrapper:unowned',
    useWrapperDataType: 'locked:unowned',
  } as MockUseBasicNameConfig,
  // DNS
  dns: {
    useValidateType: 'dns',
    useOwnerType: 'dns',
  } as MockUseBasicNameConfig,
  'dns-unwrapped-2ld': {
    useValidateType: 'valid-2ld:dns',
    useOwnerType: 'registry',
    useAddrRecordType: 'owned',
  } as MockUseBasicNameConfig,
  'dns-unwrapped-2ld:owner': {
    useValidateType: 'valid-2ld:dns',
    useOwnerType: 'registry:unowned',
    useAddrRecordType: 'owned',
  } as MockUseBasicNameConfig,
  'dns-unwrapped-2ld:manager': {
    useValidateType: 'valid-2ld:dns',
    useOwnerType: 'registry',
    useAddrRecordType: 'unowned',
  } as MockUseBasicNameConfig,
  'dns-wrapped-2ld': {
    useValidateType: 'valid-2ld:dns',
    useOwnerType: 'namewrapper',
    useWrapperDataType: 'wrapped',
    useAddrRecordType: 'owned',
  } as MockUseBasicNameConfig,
  'dns-offchain-2ld': {
    useValidateType: 'valid-2ld:dns',
    useAddrRecordType: 'owned',
  } as MockUseBasicNameConfig,
} as const

export type MockUseBasicNameType = keyof typeof mockUseBasicNameConfig

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
      canBeWrapped: false,
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
    .with(
      P.union(
        'eth-emancipated-2ld',
        'eth-emancipated-2ld:unowned',
        'eth-locked-2ld',
        'eth-locked-2ld:unowned',
        'eth-burnt-2ld',
        'eth-burnt-2ld:unowned',
      ),
      () => ({
        ...BaseBasicName,
        normalisedName: 'name.eth',
        truncatedName: 'name.eth',
        isWrapped: true,
        pccExpired: false,
        canBeWrapped: false,
        registrationStatus: 'registered' as const,
        isLoading: false,
        isCachedData: false,
      }),
    )
    .with('eth-unwrapped-2ld:grace-period', () => ({
      ...BaseBasicName,
      ownerData: makeMockUseOwnerData('registrar:grace-period:subgraph-registrant'),
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      registrationStatus: 'gracePeriod' as const,
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: false,
      isLoading: false,
      isCachedData: false,
    }))
    .with('eth-unwrapped-2ld:grace-period:unowned', () => ({
      ...BaseBasicName,
      ownerData: makeMockUseOwnerData('registrar:grace-period:subgraph-registrant:unowned'),
      normalisedName: 'name.eth',
      truncatedName: 'name.eth',
      registrationStatus: 'gracePeriod' as const,
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: false,
      isLoading: false,
      isCachedData: false,
    }))
    .with(
      P.union(
        'eth-emancipated-2ld:grace-period',
        'eth-emancipated-2ld:grace-period:unowned',
        'eth-locked-2ld:grace-period',
        'eth-locked-2ld:grace-period:unowned',
      ),
      () => ({
        ...BaseBasicName,
        normalisedName: 'name.eth',
        truncatedName: 'name.eth',
        registrationStatus: 'gracePeriod' as const,
        isWrapped: true,
        pccExpired: false,
        canBeWrapped: false,
        isLoading: false,
        isCachedData: false,
      }),
    )
    .with(P.union('eth-unwrapped-subname', 'eth-unwrapped-subname:unowned'), () => ({
      ...BaseBasicName,
      normalisedName: 'subname.name.eth',
      truncatedName: 'subname.name.eth',
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
        'eth-locked-subname',
        'eth-locked-subname:unowned',
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
    .with('dns', () => ({
      ...BaseBasicName,
      normalisedName: 'com',
      truncatedName: 'com',
      registrationStatus: 'owned' as const,
      isLoading: false,
      isWrapped: false,
      pccExpired: false,
      canBeWrapped: false,
      isCachedData: false,
    }))
    .with(
      P.union(
        'dns-unwrapped-2ld',
        'dns-unwrapped-2ld:owner',
        'dns-unwrapped-2ld:manager',
        'dns-offchain-2ld',
      ),
      () => ({
        ...BaseBasicName,
        normalisedName: 'name.com',
        truncatedName: 'name.com',
        registrationStatus: 'imported' as const,
        isWrapped: false,
        pccExpired: false,
        canBeWrapped: false,
        isLoading: false,
        isCachedData: false,
      }),
    )
    .with('dns-wrapped-2ld', () => ({
      ...BaseBasicName,
      normalisedName: 'name.com',
      truncatedName: 'name.com',
      registrationStatus: 'imported' as const,
      isWrapped: true,
      pccExpired: false,
      canBeWrapped: false,
      isLoading: false,
      isCachedData: false,
    }))
    .exhaustive()
}
