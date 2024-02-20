import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'

import { getSubnames, Name } from '@ensdomains/ensjs/subgraph'

import { CreateQueryKey, PublicClientWithChain } from '@app/types'

import { emptyAddress } from '../utils/constants'
import { useQueryOptions } from './useQueryOptions'

const FETCH_PAGE_SIZE = 50

type UseHasSubnamesParameters = {
  name?: string | undefined | null
}

type QueryKey = CreateQueryKey<UseHasSubnamesParameters, 'hasSubnames', 'graph'>

const hasSubnamesQueryFn = async ({
  queryKey: [{ name }, chainId],
}: QueryFunctionContext<QueryKey>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  let cursor: Name[] = []
  let done = false

  while (!done) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await getSubnames(publicClient, {
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

  const { queryKey } = useQueryOptions({
    params: { name },
    functionName: 'hasSubnames',
    queryDependencyType: 'graph',
  })

  const {
    data: hasSubnames,
    isLoading,
    isFetched,
    isFetchedAfterMount,
    status,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching: _isFetching,
  } = useQuery({ queryKey, queryFn: hasSubnamesQueryFn, enabled })

  return {
    hasSubnames,
    isLoading,
    isCachedData: enabled && status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
