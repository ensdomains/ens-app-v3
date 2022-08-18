import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from 'wagmi'

export const useGetHistory = (name: string, skip?: any) => {
  const { ready, getHistory } = useEns()

  const {
    data: history,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['getHistory', name], () => getHistory(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    history,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
