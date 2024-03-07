import { PersistQueryClientOptions } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { deserialize } from 'wagmi'

import { serialize } from './serialize'

const persister = () =>
  createSyncStoragePersister({
    key: 'wagmi.cache',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    serialize: (data) =>
      serialize(data, function replacer(this: any, key) {
        const directValueReference = this[key]
        if (directValueReference instanceof Date)
          return { __type: 'Date', value: directValueReference.toISOString() }
      }),
    deserialize: (data) =>
      deserialize(data, (_key, value) => {
        if (value?.__type === 'Date') return new Date(value.value)
      }),
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
