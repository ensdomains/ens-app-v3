import { expect, it } from 'vitest'

import { QueryKeyToInternalParams, queryKeyToInternalParams } from './queryKeyToInternalParams'

it('converts querykey to internal params', () => {
  const queryKey = [
    { param1: 'value1', param2: 'value2' },
    1,
    '0x123',
    'scopeKey',
    'getSomething',
  ] as const

  const expected: QueryKeyToInternalParams<typeof queryKey> = {
    functionParams: { param1: 'value1', param2: 'value2' },
    chainId: 1,
    address: '0x123',
    scopeKey: 'scopeKey',
    functionName: 'getSomething',
  }

  const result = queryKeyToInternalParams(queryKey)

  expect(result).toEqual(expected)
})

it('converts graph querykey to internal params', () => {
  const queryKey = [
    { param1: 'value1', param2: 'value2' },
    1,
    '0x123',
    'scopeKey',
    'getSomething',
    'graph',
  ] as const

  const expected: QueryKeyToInternalParams<typeof queryKey> = {
    functionParams: { param1: 'value1', param2: 'value2' },
    chainId: 1,
    address: '0x123',
    scopeKey: 'scopeKey',
    functionName: 'getSomething',
    isGraphQuery: true,
  }

  const result = queryKeyToInternalParams(queryKey)

  expect(result).toEqual(expected)
})
