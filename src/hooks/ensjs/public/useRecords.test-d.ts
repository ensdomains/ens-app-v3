import { Address } from 'viem'
import { expectTypeOf, test } from 'vitest'

import {
  GetAbiRecordReturnType,
  GetAddressRecordReturnType,
  GetContentHashRecordReturnType,
} from '@ensdomains/ensjs/public'

import { useRecords } from './useRecords'

type CachedResultType = {
  coins: [NonNullable<GetAddressRecordReturnType>]
  contentHash?: undefined
  texts?: undefined
  abi?: undefined
  resolverAddress?: undefined
}

test('has empty data type for empty parameters', () => {
  const { data } = useRecords({})

  if (!data) return

  type ExpectedType = {
    resolverAddress: Address
  }

  if (!data.resolverAddress) {
    expectTypeOf(data).toEqualTypeOf<CachedResultType>()
  } else {
    expectTypeOf(data).toEqualTypeOf<ExpectedType>()
  }
})

test('has complete data return type for all parameters', () => {
  const { data } = useRecords({
    name: 'test',
    texts: ['test'],
    coins: ['test'],
    contentHash: true,
    abi: true,
  })

  if (!data) return

  type ExpectedType = {
    coins: NonNullable<GetAddressRecordReturnType>[]
    contentHash: GetContentHashRecordReturnType
    texts: { key: string; value: string }[]
    abi: GetAbiRecordReturnType
    resolverAddress: Address
  }

  if (!data.resolverAddress) {
    expectTypeOf(data).toEqualTypeOf<CachedResultType>()
  } else {
    expectTypeOf(data).toEqualTypeOf<ExpectedType>()
  }
})

test('has only coins when coins specified', () => {
  const { data } = useRecords({
    coins: ['test'],
  })

  if (!data) return

  type ExpectedType = {
    coins: NonNullable<GetAddressRecordReturnType>[]
    resolverAddress: Address
  }

  if (!data.resolverAddress) {
    expectTypeOf(data).toEqualTypeOf<CachedResultType>()
  } else {
    expectTypeOf(data).toEqualTypeOf<ExpectedType>()
  }
})

test('has only contentHash when contentHash specified', () => {
  const { data } = useRecords({
    contentHash: true,
  })

  if (!data) return

  type ExpectedType = {
    contentHash: GetContentHashRecordReturnType
    resolverAddress: Address
  }

  if (!data.resolverAddress) {
    expectTypeOf(data).toEqualTypeOf<CachedResultType>()
  } else {
    expectTypeOf(data).toEqualTypeOf<ExpectedType>()
  }
})

test('has only texts when texts specified', () => {
  const { data } = useRecords({
    texts: ['test'],
  })

  if (!data) return

  type ExpectedType = {
    texts: { key: string; value: string }[]
    resolverAddress: Address
  }

  if (!data.resolverAddress) {
    expectTypeOf(data).toEqualTypeOf<CachedResultType>()
  } else {
    expectTypeOf(data).toEqualTypeOf<ExpectedType>()
  }
})

test('has only abi when abi specified', () => {
  const { data } = useRecords({
    abi: true,
  })

  if (!data) return

  type ExpectedType = {
    abi: GetAbiRecordReturnType
    resolverAddress: Address
  }

  if (!data.resolverAddress) {
    expectTypeOf(data).toEqualTypeOf<CachedResultType>()
  } else {
    expectTypeOf(data).toEqualTypeOf<ExpectedType>()
  }
})
