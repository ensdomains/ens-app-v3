import { Address } from 'viem'
import { expectTypeOf, test } from 'vitest'

import { SupportedChain } from '@app/constants/chains'

import { matchQueryKeyMeta } from './matchQueryKeyMeta'

const params = {
  internalParams: {
    functionParams: { param1: 'value1', param2: 'value2' },
    chainId: 1,
    address: '0x123',
    scopeKey: 'scopeKey',
    functionName: 'getSomething',
  },
  matchFunctionName: 'getSomething',
  matchParameters: ['param1'],
} as const
const matchKey = [] as readonly unknown[]
const matched = matchQueryKeyMeta(params, matchKey)

test('resolves to correct array for matched params', () => {
  type ExpectedType = readonly [
    {
      param1: 'value1'
    },
    SupportedChain['id'],
    Address | undefined,
    string | undefined,
    'getSomething',
  ]

  if (matched) {
    expectTypeOf(matchKey).toEqualTypeOf<ExpectedType>()
  }
})

test('resolves to unknown array for non-matched params', () => {
  if (!matched) {
    expectTypeOf(matchKey).toEqualTypeOf<readonly unknown[]>()
  }
})
