import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

export const useGetWrapperData = (name: string, skip?: any) => {
  const { ready, getWrapperData } = useEns()

  const {
    data: wrapperData,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['getWrapperData', name], () => getWrapperData(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    wrapperData,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
