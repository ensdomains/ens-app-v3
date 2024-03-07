import type { PersistQueryClientOptions } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import type { QueryClient } from '@tanstack/react-query'
import { deserialize } from 'wagmi'

import { serialize } from './serialize'

export const stringify = <TData = unknown>(data: TData) =>
  serialize(data, function innerReplacer(this: any, key) {
    const directValueReference = this[key]
    if (directValueReference instanceof Date)
      return { __type: 'Date', value: directValueReference.toISOString() }
  })

export const parse = <TData = unknown>(data: string) =>
  deserialize<TData>(data, (_key, value) => {
    if (value?.__type === 'Date') return new Date(value.value)
  })

const persister = () =>
  createSyncStoragePersister({
    key: 'wagmi.cache',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    serialize: stringify,
    deserialize: parse,
  })

export const createPersistConfig = ({
  queryClient,
}: {
  queryClient: QueryClient
}): PersistQueryClientOptions => ({
  queryClient,
  persister: persister(),
  dehydrateOptions: {
    shouldDehydrateQuery: (query: any) =>
      query.gcTime !== 0 && query.queryHash !== JSON.stringify([{ entity: 'signer' }]),
  },
  buster: process.env.CONFIG_BUILD_ID,
})
