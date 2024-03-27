import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { createAccounts } from '../../playwright/fixtures/accounts'
import { makeMockUseContractAddress } from './makeMockUseContractAddress'

const mockUseOwnerTypes = [
  'eth',
  'registrar',
  'registrar:owner',
  'registrar:manager',
  'registrar:unowned',
  'registrar:available',
  'registrar:grace-period',
  'registrar:grace-period:unowned',
  'registrar:grace-period:subgraph-registrant',
  'registrar:grace-period:subgraph-registrant',
  'registrar:grace-period:subgraph-registrant:unowned',
  'registrar:expired',
  'namewrapper',
  'namewrapper:unowned',
  'namewrapper:grace-period',
  'registry',
  'registry:unowned',
  'dns',
] as const

export type MockUseOwnerType = (typeof mockUseOwnerTypes)[number] | undefined

const userAddress = createAccounts().getAddress('user') as Address
const user2Address = createAccounts().getAddress('user2') as Address

export const makeMockUseOwnerData = (type: MockUseOwnerType): GetOwnerReturnType | undefined =>
  match(type)
    .with('eth', () => ({
      owner: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address,
      ownershipLevel: 'registry' as const,
      registrant: undefined,
    }))
    .with('registrar', () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: userAddress,
    }))
    .with('registrar:available', () => null)
    .with('registrar:owner', () => ({
      owner: user2Address,
      ownershipLevel: 'registrar' as const,
      registrant: userAddress,
    }))
    .with('registrar:manager', () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: user2Address,
    }))
    .with('registrar:unowned', () => ({
      owner: user2Address,
      ownershipLevel: 'registrar' as const,
      registrant: user2Address,
    }))
    .with(P.union('registrar:grace-period', 'registrar:grace-period:unowned'), (_type) => ({
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .with(
      P.union(
        'registrar:grace-period:subgraph-registrant',
        'registrar:grace-period:subgraph-registrant:unowned',
      ),
      (_type) => ({
        owner: _type.endsWith('unowned') ? user2Address : userAddress,
        ownershipLevel: 'registrar' as const,
        registrant: _type.endsWith('unowned') ? user2Address : userAddress,
      }),
    )
    .with('registrar:expired', () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .with(P.union('namewrapper', 'namewrapper:unowned'), (_type) => ({
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
      ownershipLevel: 'nameWrapper' as const,
    }))
    .with(P.union('namewrapper:grace-period'), () => ({
      owner: makeMockUseContractAddress({ contract: 'ensNameWrapper' }),
      ownershipLevel: 'registrar' as const,
      registrant: makeMockUseContractAddress({ contract: 'ensNameWrapper' }),
    }))
    .with(P.union('registry', 'registry:unowned'), (_type) => ({
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
      ownershipLevel: 'registry' as const,
    }))
    .with('dns', () => ({
      owner: '0xB32cB5677a7C971689228EC835800432B339bA2B' as Address,
      ownershipLevel: 'registry' as const,
    }))
    .with(P.nullish, () => null)
    .exhaustive()
