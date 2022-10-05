import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

export const useGetFuseData = (name: string, skip?: any) => {
  const { ready, getWrapperData } = useEns()

  const {
    data: fuseData,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['getFuseData', name], () => getWrapperData(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    fuseData,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
