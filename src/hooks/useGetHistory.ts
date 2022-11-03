import { useQuery } from '@tanstack/react-query'

import { useEns } from '@app/utils/EnsProvider'

export const useGetHistory = (name: string, skip?: any) => {
  const { ready, getHistory } = useEns()

  const {
    data: history,
    isLoading,
    status,
    isFetched,
  } = useQuery(['graph', 'getHistory', name], () => getHistory(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    history,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched,
  }
}
