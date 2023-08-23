import { useQueryKeys } from "@app/utils/cacheKeyFactory"
import { GetNameHistoryParameters, getNameHistory } from "@ensdomains/ensjs/subgraph"
import { useQuery } from "wagmi"
import { usePublicClient } from "../../usePublicClient"

type UseNameHistoryParameters = GetNameHistoryParameters & {
  enabled?: boolean
}

export const useNameHistory = ({
  enabled = true,
  ...params
}: UseNameHistoryParameters) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    ...rest
  } = useQuery(queryKeys.getNameHistory(params), ({ queryKey: [params] }) => getNameHistory(publicClient, params), {
    enabled: enabled && !!params.name,
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