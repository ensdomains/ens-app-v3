import { useQueryKeys } from "@app/utils/cacheKeyFactory"
import { GetSubgraphRecordsParameters, getSubgraphRecords } from "@ensdomains/ensjs/subgraph"
import { useQuery } from "wagmi"
import { usePublicClient } from "../../usePublicClient"

type UseSubgraphRecordsParameters = GetSubgraphRecordsParameters & {
  enabled?: boolean
}

export const useSubgraphRecords = ({
  enabled = true,
  ...params
}: UseSubgraphRecordsParameters) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    ...rest
  } = useQuery(queryKeys.getSubgraphRecords(params), ({ queryKey: [params] }) => getSubgraphRecords(publicClient, params), {
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