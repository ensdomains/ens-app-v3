/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { createAccounts } from '../../playwright/fixtures/accounts'
import type { useOwners } from '../../src/hooks/useOwners'
import { MockUseAbilitiesType } from './makeMockUseAbilitiesData'
import { MockUseDNSOwnerType } from './makeMockUseDnsOwnerData'
import { MockUseOwnerType } from './makeMockUseOwnerData'
import { MockUseWrapperDataType } from './makeMockUseWrapperDataData.ts'

type MockUseOwnersConfig = {
  ownerType: MockUseOwnerType
  wrapperDataType: MockUseWrapperDataType
  dnsOwnerType: MockUseDNSOwnerType
  abilitiesType: MockUseAbilitiesType
}
export const mockUseOwnersConfigMap = {
  'eth-unwrapped-2ld': {
    ownerType: 'registrar',
    abilitiesType: 'eth-unwrapped-2ld',
  } as MockUseOwnersConfig,
  'eth-unwrapped-2ld:manager': {
    ownerType: 'registrar:manager',
    abilitiesType: 'eth-unwrapped-2ld:manager',
  } as MockUseOwnersConfig,
  'eth-unwrapped-2ld:owner': {
    ownerType: 'registrar:owner',
    abilitiesType: 'eth-unwrapped-2ld:owner',
  } as MockUseOwnersConfig,
  'eth-emancipated-2ld': {
    ownerType: 'namewrapper',
    wrapperDataType: 'emancipated',
    abilitiesType: 'eth-emancipated-2ld',
  } as MockUseOwnersConfig,
  'eth-emancipated-2ld:unowned': {
    ownerType: 'namewrapper:unowned',
    wrapperDataType: 'emancipated:unowned',
    abilitiesType: 'eth-emancipated-2ld:unowned',
  } as MockUseOwnersConfig,
  'eth-unwrapped-2ld:grace-period': {
    ownerType: 'registrar:grace-period:subgraph-registrant',
    abilitiesType: 'eth-unwrapped-2ld:grace-period',
  } as MockUseOwnersConfig,
  'eth-emancipated-2ld:grace-period': {
    ownerType: 'namewrapper:grace-period',
    wrapperDataType: 'emancipated',
    abilitiesType: 'eth-emancipated-2ld:grace-period',
  } as MockUseOwnersConfig,
  'eth-unwrapped-subname': {
    ownerType: 'registry',
    abilitiesType: 'eth-unwrapped-subname+unwrapped-2ld:unowned',
  } as MockUseOwnersConfig,
  'eth-wrapped-subname': {
    ownerType: 'namewrapper',
    wrapperDataType: 'wrapped',
    abilitiesType: 'eth-wrapped-subname+emancipated-2ld:unowned',
  } as MockUseOwnersConfig,
  'eth-emancipated-subname': {
    ownerType: 'namewrapper',
    wrapperDataType: 'emancipated',
    abilitiesType: 'eth-emancipated-subname+emancipated-2ld:unowned',
  } as MockUseOwnersConfig,
} as const

type MockUseOwnersType = keyof typeof mockUseOwnersConfigMap
export const mockUseOwnersTypes = Object.keys(mockUseOwnersConfigMap) as MockUseOwnersType[]

const userAddress = createAccounts().getAddress('user') as Address
const user2Address = createAccounts().getAddress('user2') as Address

export const makeMockUseOwners = (
  type?: MockUseOwnersType,
): ReturnType<typeof useOwners> | undefined => {
  return match(type)
    .with(P.union('eth-unwrapped-2ld'), () => [
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.controller',
        label: 'name.manager',
        testId: 'owner-button-owner',
        transferType: 'manager' as const,
      },
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.registrant',
        label: 'name.owner',
        testId: 'owner-button-registrant',
        transferType: 'owner' as const,
      },
    ])
    .with('eth-unwrapped-2ld:manager', () => [
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.controller',
        label: 'name.manager',
        testId: 'owner-button-owner',
        transferType: 'manager' as const,
      },
      {
        address: user2Address,
        canTransfer: false,
        description: 'details.descriptions.registrant',
        label: 'name.owner',
        testId: 'owner-button-registrant',
        transferType: 'owner' as const,
      },
    ])
    .with('eth-unwrapped-2ld:owner', () => [
      {
        address: user2Address,
        canTransfer: true,
        description: 'details.descriptions.controller',
        label: 'name.manager',
        testId: 'owner-button-owner',
        transferType: 'manager' as const,
      },
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.registrant',
        label: 'name.owner',
        testId: 'owner-button-registrant',
        transferType: 'owner' as const,
      },
    ])
    .with('eth-emancipated-2ld', () => [
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.owner',
        label: 'name.owner',
        testId: 'owner-button-owner',
        transferType: 'owner' as const,
      },
    ])
    .with('eth-emancipated-2ld:unowned', () => [
      {
        address: user2Address,
        canTransfer: false,
        description: 'details.descriptions.owner',
        label: 'name.owner',
        testId: 'owner-button-owner',
        transferType: 'owner' as const,
      },
    ])
    .with('eth-unwrapped-2ld:grace-period', () => [
      {
        address: userAddress,
        canTransfer: false,
        description: 'details.descriptions.controller',
        label: 'name.manager',
        testId: 'owner-button-owner',
        transferType: 'manager' as const,
      },
      {
        address: userAddress,
        canTransfer: false,
        description: 'details.descriptions.registrant',
        label: 'name.owner',
        testId: 'owner-button-registrant',
        transferType: 'owner' as const,
      },
    ])
    .with('eth-emancipated-2ld:grace-period', () => [
      {
        address: userAddress,
        canTransfer: false,
        description: 'details.descriptions.owner',
        label: 'name.owner',
        testId: 'owner-button-owner',
        transferType: 'owner' as const,
      },
    ])
    .with('eth-unwrapped-subname', () => [
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.controller',
        label: 'name.manager',
        testId: 'owner-button-owner',
        transferType: 'manager' as const,
      },
    ])
    .with('eth-wrapped-subname', () => [
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.manager',
        label: 'name.manager',
        testId: 'owner-button-manager',
        transferType: 'manager' as const,
      },
    ])
    .with('eth-emancipated-subname', () => [
      {
        address: userAddress,
        canTransfer: true,
        description: 'details.descriptions.owner',
        label: 'name.owner',
        testId: 'owner-button-owner',
        transferType: 'owner' as const,
      },
    ])
    .with(P.nullish, () => undefined)
    .exhaustive()
}
