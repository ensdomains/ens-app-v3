import { QueryFunctionContext, queryOptions } from '@tanstack/react-query'

import { getSubnames, Name } from '@ensdomains/ensjs/subgraph'

import { ConfigWithEns, CreateQueryKey } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { useQuery } from '@app/utils/query/useQuery'

import { emptyAddress } from '../utils/constants'
import { useQueryOptions } from './useQueryOptions'

const FETCH_PAGE_SIZE = 50

type UseHasSubnamesParameters = {
  name?: string | undefined | null
}

type QueryKey = CreateQueryKey<UseHasSubnamesParameters, 'hasSubnames', 'graph'>

const hasSubnamesQueryFn =
  (config: ConfigWithEns) =>
  async ({ queryKey: [{ name }, chainId] }: QueryFunctionContext<QueryKey>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    let cursor: Name[] = []
    let done = false

    while (!done) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await getSubnames(client, {
          name,
          previousPage: cursor,
          orderBy: 'labelName',
          orderDirection: 'desc',
          pageSize: FETCH_PAGE_SIZE,
        })
        const subnames = result || []
        const anyHasOwner = subnames.some((subname) => subname.owner !== emptyAddress)
        if (anyHasOwner) {
          return true
        }
        done = subnames.length !== FETCH_PAGE_SIZE
        cursor = subnames
      } catch {
        return false
      }
    }

    return false
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
