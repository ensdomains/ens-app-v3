import { match } from 'ts-pattern'
import { Address } from 'viem'

import { createAccounts } from '../../playwright/fixtures/accounts'
import { UseSubgraphRegistrantReturnType } from '../../src/hooks/ensjs/subgraph/useSubgraphRegistrant'

const mockUseSubgraphRegistrantTypes = ['owned', 'unowned'] as const
export type MockUseSubgraphRegistrantType =
  | (typeof mockUseSubgraphRegistrantTypes)[number]
  | undefined

export const makeMockUseSubgraphRegistrantData = (
  type: MockUseSubgraphRegistrantType,
): UseSubgraphRegistrantReturnType | undefined =>
  match(type)
    .with('owned', () => createAccounts().getAddress('user') as Address)
    .with('unowned', () => createAccounts().getAddress('user2') as Address)
    .otherwise(() => undefined)
