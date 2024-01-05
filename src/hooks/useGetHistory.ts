import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useGlobalErrorFunc } from './errors/useGlobalErrorFunc'

export const useGetHistory = (name: string, skip?: any) => {
  const { ready, getHistory } = useEns()

  const queryKey = useQueryKeys().getHistory(name)
  const watchedGetHistory = useGlobalErrorFunc<typeof getHistory>({
    queryKey,
    func: getHistory,
  })
  const {
    data: history,
    isLoading,
    status,
    isFetched,
    isFetchedAfterMount,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
  } = useQuery(
    queryKey,
    async () => {
      const data = await watchedGetHistory(name)
      return data || null
    },
    {
      enabled: ready && !skip && name !== '',
    },
  )

  return {
    history,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
