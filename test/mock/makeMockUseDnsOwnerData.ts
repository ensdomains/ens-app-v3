import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetDnsOwnerReturnType } from '@ensdomains/ensjs/dns'

import { createAccounts } from '../../playwright/fixtures/accounts'

const userAddress = createAccounts().getAddress('user') as Address
const user2Address = createAccounts().getAddress('user2') as Address

const mockUseDnsOwnerTypes = ['owner', 'unowned'] as const
export type MockUseDNSOwnerType = (typeof mockUseDnsOwnerTypes)[number] | undefined

export const makeMockUseDnsOwnerData = (type: MockUseDNSOwnerType): GetDnsOwnerReturnType =>
  match(type)
    .with('owner', () => userAddress)
    .with('unowned', () => user2Address)
    .with(P.nullish, () => null)
    .exhaustive()
