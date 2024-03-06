import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { createAccounts } from '../../playwright/fixtures/accounts'
import { makeMockUseContractAddress } from './makeMockUseContractAddress'

const mockUseOwnerTypes = [
  'eth',
  'eth-available-2ld',
  'eth-unwrapped-2ld',
  'eth-unwrapped-2ld:owner',
  'eth-unwrapped-2ld:manager',
  'eth-unwrapped-2ld:unowned',
  'eth-grace-period-unwrapped-2ld',
  'eth-grace-period-unwrapped-2ld-with-registry-registrant',
  'eth-grace-period-unwrapped-2ld:unowned',
  'eth-grace-period-unwrapped-2ld-with-registry-registrant:unowned',
  'eth-wrapped-2ld',
  'eth-grace-period-wrapped-2ld',
  'eth-expired-2ld',
  'eth-unwrapped-subname',
  'eth-unwrapped-subname:unowned',
  'eth-wrapped-subname',
  'eth-wrapped-subname:unowned',
  'namewrapper',
  'namewrapper:unowned',
  'registry',
  'registry:unowned',
  'dns',
] as const

export type MockUseOwnerType = (typeof mockUseOwnerTypes)[number] | undefined

type Overrides = {
  owner?: Address
  registrant?: Address
}

const userAddress = createAccounts().getAddress('user') as Address
const user2Address = createAccounts().getAddress('user2') as Address

export const makeMockUseOwnerData = (
  type: MockUseOwnerType,
  overides?: Overrides,
): GetOwnerReturnType | undefined =>
  match(type)
    .with('eth', () => ({
      owner: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address,
      ownershipLevel: 'registry' as const,
      registrant: undefined,
    }))
    .with('eth-available-2ld', () => null)
    .with('eth-unwrapped-2ld', () => ({
      owner: overides?.owner || userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: overides?.registrant || userAddress,
    }))
    .with('eth-unwrapped-2ld:owner', () => ({
      owner: user2Address,
      ownershipLevel: 'registrar' as const,
      registrant: userAddress,
    }))
    .with('eth-unwrapped-2ld:manager', () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: user2Address,
    }))
    .with('eth-unwrapped-2ld:unowned', () => ({
      owner: user2Address,
      ownershipLevel: 'registrar' as const,
      registrant: user2Address,
    }))
    .with(P.union('eth-grace-period-unwrapped-2ld'), () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .with(P.union('eth-grace-period-unwrapped-2ld:unowned'), () => ({
      owner: user2Address,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .with(P.union('eth-grace-period-unwrapped-2ld-with-registry-registrant'), () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: userAddress,
    }))
    .with(P.union('eth-grace-period-unwrapped-2ld-with-registry-registrant:unowned'), () => ({
      owner: user2Address,
      ownershipLevel: 'registrar' as const,
      registrant: user2Address,
    }))
    .with(P.union('eth-wrapped-2ld', 'eth-wrapped-subname'), (type_) => ({
      owner: type_.endsWith('unowned') ? user2Address : userAddress,
      ownershipLevel: 'nameWrapper' as const,
    }))
    .with(P.union('eth-grace-period-wrapped-2ld'), () => ({
      owner: makeMockUseContractAddress({ contract: 'ensNameWrapper' }),
      ownershipLevel: 'registrar' as const,
      registrant: makeMockUseContractAddress({ contract: 'ensNameWrapper' }),
    }))
    .with('eth-expired-2ld', () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .with('eth-unwrapped-subname', () => ({
      owner: userAddress,
      ownershipLevel: 'registry' as const,
    }))
    .with('eth-unwrapped-subname:unowned', () => ({
      owner: user2Address,
      ownershipLevel: 'registry' as const,
    }))
    .with('eth-wrapped-subname:unowned', () => ({
      owner: user2Address,
      ownershipLevel: 'nameWrapper' as const,
    }))
    .with(P.union('namewrapper', 'namewrapper:unowned'), (_type) => ({
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
      ownershipLevel: 'nameWrapper' as const,
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
