import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

export const useGetHistory = (name: string, skip?: any) => {
  const { ready, getHistory } = useEns()

  const {
    data: history,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['getHistory', name, 'graph'], () => getHistory(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    history,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
