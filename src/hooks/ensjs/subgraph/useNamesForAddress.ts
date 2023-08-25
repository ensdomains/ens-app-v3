import { useQueryKeys } from "@app/utils/cacheKeyFactory"
import { GetNamesForAddressParameters, getNamesForAddress } from "@ensdomains/ensjs/subgraph"
import { useInfiniteQuery } from "wagmi"
import { usePublicClient } from "../../usePublicClient"

type UseNamesForAddressParameters = Omit<GetNamesForAddressParameters, 'previousPage'> & {
  enabled?: boolean
}

export const useNamesForAddressPaginated = ({
  enabled = true,
  ...params
}: UseNamesForAddressParameters) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    ...rest
  } = useInfiniteQuery(queryKeys.getNamesForAddress(params), ({ queryKey: [params], pageParam }) => getNamesForAddress(publicClient, { ...params, previousPage: pageParam }), {
    enabled: enabled && !!params.address,
    getNextPageParam: (lastPage) => {
      if (lastPage?.length < (params.pageSize || 100)) return false
      return lastPage
    }
  })

  return {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}