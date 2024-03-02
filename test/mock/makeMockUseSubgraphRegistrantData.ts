import { match } from 'ts-pattern'
import { Address } from 'viem'

import { createAccounts } from '../../playwright/fixtures/accounts'
import { UseSubgraphRegistrantReturnType } from '../../src/hooks/ensjs/subgraph/useSubgraphRegistrant'

const mockUseSubgraphRegistrantTypes = ['eth-grace-period-unwrapped-2ld'] as const
export type MockUsePriceType = (typeof mockUseSubgraphRegistrantTypes)[number]

export const makeMockUseSubgraphRegistrantData = (
  type: MockUsePriceType,
): UseSubgraphRegistrantReturnType | undefined =>
  match(type)
    .with('eth-grace-period-unwrapped-2ld', () => createAccounts().getAddress('user') as Address)
    .otherwise(() => undefined)
