import { QueryFunctionContext, queryOptions } from '@tanstack/react-query'

import { ConfigWithEns, CreateQueryKey } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { useQuery } from '@app/utils/query/useQuery'
import { getSnrcSubnames } from '@app/utils/snrcSubnames'

import { useQueryOptions } from './useQueryOptions'

type UseHasSubnamesParameters = {
  name?: string | undefined | null
}

type QueryKey = CreateQueryKey<UseHasSubnamesParameters, 'hasSubnames', 'graph'>

const hasSubnamesQueryFn =
  (config: ConfigWithEns) =>
  async ({ queryKey: [{ name }, chainId] }: QueryFunctionContext<QueryKey>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })
    // No subgraph: a name "has subnames" iff the SubnameRegistrar lists at least
    // one still-owned child.
    try {
      const subnames = await getSnrcSubnames(client, chainId, name)
      return subnames.length > 0
    } catch {
      return false
    }
  }

export const useHasSubnames = (name: string) => {
  const isSubname = !!name && name.split('.').length > 2
  const enabled = !!name && isSubname

  const initialOptions = useQueryOptions({
    params: { name },
    functionName: 'hasSubnames',
    queryDependencyType: 'graph',
    queryFn: hasSubnamesQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    enabled,
  })

  return {
    ...query,
    isCachedData: getIsCachedData(query),
  }
}
