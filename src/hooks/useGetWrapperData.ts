import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

export const useGetWrapperData = (name: string, skip?: any) => {
  const { ready, getWrapperData } = useEns()

  const {
    data: wrapperData,
    isLoading,
    status,
    isFetched,
    isFetchedAfterMount,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching: _,
  } = useQuery(
    useQueryKeys().getWrapperData(name),
    () => getWrapperData(name).then((d) => d || null),
    {
      enabled: ready && !skip && name !== '',
    },
  )

  return {
    wrapperData,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
