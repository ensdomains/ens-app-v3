import { match } from 'ts-pattern'

import { GetPriceReturnType } from '@ensdomains/ensjs/public'

const mockUsePriceTypes = [
  'tld',
  'eth-available-normal-2ld', // Is the price data always the same
  'eth-available-premium-2ld',
  'undefined',
] as const
export type MockUsePriceType = (typeof mockUsePriceTypes)[number]

export const makeMockUsePriceData = (type: MockUsePriceType): GetPriceReturnType | undefined =>
  match(type)
    .with('tld', () => undefined)
    .with('eth-available-normal-2ld', () => ({ base: 3203936997786453n, premium: 0n }))
    .with('eth-available-premium-2ld', () => ({
      base: 3203936997786453n,
      premium: 3203936997786453n,
    }))
    .with('undefined', () => undefined)
    .exhaustive()
