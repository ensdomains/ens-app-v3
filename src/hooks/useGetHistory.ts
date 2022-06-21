import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from 'react-query'

export const useGetHistory = (name: string, skip?: any) => {
  const { ready, getHistory } = useEns()

  const {
    data: history,
    isLoading,
    status,
  } = useQuery(['getHistory', name], () => getHistory(name), {
    enabled: ready && !skip && name !== '',
  })

  return { history, isLoading, status }
}
