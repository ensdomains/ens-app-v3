import { match, P } from 'ts-pattern'

import { GetPriceReturnType } from '@ensdomains/ensjs/public'

const mockUsePriceTypes = ['tld', 'base', 'premium'] as const
export type MockUsePriceType = (typeof mockUsePriceTypes)[number] | undefined

export const makeMockUsePriceData = (type: MockUsePriceType): GetPriceReturnType | undefined =>
  match(type)
    .with('tld', () => undefined)
    .with('base', () => ({ base: 3203936997786453n, premium: 0n }))
    .with('premium', () => ({
      base: 3203936997786453n,
      premium: 3203936997786453n,
    }))
    .with(P.nullish, () => undefined)
    .exhaustive()
