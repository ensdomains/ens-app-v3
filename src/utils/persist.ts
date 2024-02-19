import { PersistQueryClientOptions } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { deserialize, serialize } from 'wagmi'

const persister = createSyncStoragePersister({
  key: 'wagmi.cache',
  storage: window.localStorage,
  serialize,
  deserialize,
})

export const createPersistConfig = ({
  queryClient,
}: {
  queryClient: QueryClient
}): PersistQueryClientOptions => ({
  queryClient,
  persister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: any) =>
      query.cacheTime !== 0 && query.queryHash !== JSON.stringify([{ entity: 'signer' }]),
  },
  buster: process.env.CONFIG_BUILD_ID,
})
