import { Address } from 'viem'
import { expectTypeOf, test } from 'vitest'

import { SupportedChain } from '@app/constants/chains'
import { CreateQueryKey } from '@app/types'

import { queryKeyToInternalParams } from './queryKeyToInternalParams'

test('standard', () => {
  const dummyQueryKey = [] as unknown as CreateQueryKey<
    { name: string },
    'getAddressRecord',
    'standard'
  >
  const result = queryKeyToInternalParams(dummyQueryKey)

  expectTypeOf(result).toEqualTypeOf<{
    functionParams: { name: string }
    chainId: SupportedChain['id']
    address: Address | undefined
    scopeKey: string | undefined
    functionName: 'getAddressRecord'
  }>()
})

test('independent', () => {
  const dummyQueryKey = [] as unknown as CreateQueryKey<
    { name: string },
    'getDnsOwner',
    'independent'
  >
  const result = queryKeyToInternalParams(dummyQueryKey)

  expectTypeOf(result).toEqualTypeOf<{
    functionParams: { name: string }
    chainId: undefined
    address: undefined
    scopeKey: string | undefined
    functionName: 'getDnsOwner'
  }>()
})

test('graph', () => {
  const dummyQueryKey = [] as unknown as CreateQueryKey<
    { name: string },
    'getSubgraphRegistrant',
    'graph'
  >
  const result = queryKeyToInternalParams(dummyQueryKey)

  expectTypeOf(result).toEqualTypeOf<{
    functionParams: { name: string }
    chainId: SupportedChain['id']
    address: Address | undefined
    scopeKey: string | undefined
    functionName: 'getSubgraphRegistrant'
    isGraphQuery: true
  }>()
})
