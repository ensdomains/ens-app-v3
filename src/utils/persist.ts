import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import type { QueryClient } from '@tanstack/react-query'
import { deserialize, serialize } from 'wagmi'

export const makePersistent = (queryClient: QueryClient) => {
  if (typeof window !== 'undefined') {
    const persister = createSyncStoragePersister({
      key: 'wagmi.cache',
      storage: window.localStorage,
      serialize,
      deserialize,
    })

    persistQueryClient({
      queryClient,
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query: any) =>
          query.cacheTime !== 0 && query.queryHash !== JSON.stringify([{ entity: 'signer' }]),
      },
      buster: process.env.CONFIG_BUILD_ID,
    })
  }
}
