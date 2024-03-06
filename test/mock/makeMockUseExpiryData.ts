import { match, P } from 'ts-pattern'

import { GetExpiryReturnType } from '@ensdomains/ensjs/public'

const mockUseExpiryTypes = ['eth', 'active', 'grace-period'] as const
export type MockUseExpiryType = (typeof mockUseExpiryTypes)[number] | undefined

export const makeMockUseExpiryData = (type: MockUseExpiryType): GetExpiryReturnType | undefined =>
  match(type)
    .with('eth', () => ({
      expiry: {
        date: new Date('+275760-09-13T00:00:00.000Z'),
        value: 18446744073709551615n,
      },
      gracePeriod: 0,
      status: 'active' as const,
    }))
    .with('active', () => ({
      expiry: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        value: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 365),
      },
      gracePeriod: 7776000,
      status: 'active' as const,
    }))
    .with('grace-period', () => ({
      expiry: {
        date: new Date(Date.now() - 7776000 / 2),
        value: BigInt(Date.now() - 7776000 / 2),
      },
      gracePeriod: 7776000,
      status: 'active' as const,
    }))
    .with(P.nullish, () => null)
    .exhaustive()
