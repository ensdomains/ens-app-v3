import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { createAccounts } from '../../playwright/fixtures/accounts'
import { makeMockUseContractAddress } from './makeMockUseContractAddress'

const mockUseOwnerTypes = [
  'eth',
  'eth-available-2ld',
  'eth-unwrapped-2ld',
  'eth-grace-period-unwrapped-2ld',
  'eth-grace-period-unwrapped-2ld-with-registry-registrant',
  'eth-wrapped-2ld',
  'eth-grace-period-wrapped-2ld',
  'eth-expired-2ld',
  'eth-wrapped-subname',
] as const

export type MockUseOwnerType = (typeof mockUseOwnerTypes)[number]

type Overrides = {
  owner?: Address
  registrant?: Address
}

const userAddress = createAccounts().getAddress('user') as Address
// const user2Address = createAccounts().getAddress('user2') as Address

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
    .with(P.union('eth-grace-period-unwrapped-2ld'), () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .with(P.union('eth-grace-period-unwrapped-2ld-with-registry-registrant'), () => ({
      owner: userAddress,
      ownershipLevel: 'registrar' as const,
      registrant: userAddress,
    }))
    .with(P.union('eth-wrapped-2ld', 'eth-wrapped-subname'), () => ({
      owner: userAddress,
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
    .exhaustive()
