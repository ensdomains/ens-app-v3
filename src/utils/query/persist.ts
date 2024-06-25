import type {
  PersistedClient,
  Persister,
  PersistQueryClientOptions,
} from '@tanstack/query-persist-client-core'
import type { QueryClient } from '@tanstack/react-query'
import { del, get, set } from 'idb-keyval'
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

function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client)
    },
    restoreClient: async () => {
      return get<PersistedClient>(idbValidKey)
    },
    removeClient: async () => {
      await del(idbValidKey)
    },
  } as Persister
}

const persister = () => createIDBPersister('wagmi.cache')

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
