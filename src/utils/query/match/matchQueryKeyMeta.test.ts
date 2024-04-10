import { expect, it } from 'vitest'

import { matchQueryKeyMeta } from './matchQueryKeyMeta'

it.each([
  {
    shouldMatch: true,
    matchType: 'all matching',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: ['param1'],
    matchKey: [{ param1: 'value1', param2: 'value2' }, 1, '0x123', 'scopeKey', 'getSomething'],
  },
  {
    shouldMatch: true,
    matchType: 'no match parameters',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: [],
    matchKey: [{ random1: 'value1', random2: 'value2' }, 1, '0x123', 'scopeKey', 'getSomething'],
  },
  {
    shouldMatch: false,
    matchType: 'mismatched function name',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomethingElse',
    matchParameters: ['param1'],
    matchKey: [{ param1: 'value1', param2: 'value2' }, 1, '0x123', 'scopeKey', 'getSomething'],
  },
  {
    shouldMatch: false,
    matchType: 'mismatched chain id',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: ['param1'],
    matchKey: [{ param1: 'value1', param2: 'value2' }, 2, '0x123', 'scopeKey', 'getSomething'],
  },
  {
    shouldMatch: false,
    matchType: 'mismatched address',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: ['param1'],
    matchKey: [{ param1: 'value1', param2: 'value2' }, 1, '0x124', 'scopeKey', 'getSomething'],
  },
  {
    shouldMatch: false,
    matchType: 'mismatched scope key',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: ['param1'],
    matchKey: [{ param1: 'value1', param2: 'value2' }, 1, '0x123', 'scopeKey2', 'getSomething'],
  },
  {
    shouldMatch: false,
    matchType: 'function params not object',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: ['param1'],
    matchKey: ['', 1, '0x123', 'scopeKey2', 'getSomething'],
  },
  {
    shouldMatch: false,
    matchType: 'param key not in matched params object',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: ['param1'],
    matchKey: [{ param2: 'value2' }, 1, '0x123', 'scopeKey', 'getSomething'],
  },
  {
    shouldMatch: false,
    matchType: 'param value mismatch',
    internalParams: {
      functionParams: { param1: 'value1', param2: 'value2' },
      chainId: 1,
      address: '0x123',
      scopeKey: 'scopeKey',
      functionName: 'getSomething',
    },
    matchFunctionName: 'getSomething',
    matchParameters: ['param1'],
    matchKey: [{ param1: 'value2', param2: 'value2' }, 1, '0x123', 'scopeKey', 'getSomething'],
  },
] as const)(
  'matches $shouldMatch when $matchType',
  ({ internalParams, matchFunctionName, matchParameters, matchKey, shouldMatch }) => {
    expect(
      matchQueryKeyMeta({ internalParams, matchFunctionName, matchParameters }, matchKey),
    ).toBe(shouldMatch)
  },
)
