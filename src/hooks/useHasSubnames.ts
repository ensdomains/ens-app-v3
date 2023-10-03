import { useQuery } from 'wagmi'

import { getSubnames, Name } from '@ensdomains/ensjs/subgraph'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { emptyAddress } from '../utils/constants'
import { usePublicClient } from './usePublicClient'

const FETCH_PAGE_SIZE = 50

export const useHasSubnames = (name: string) => {
  const publicClient = usePublicClient()

  const isSubname = !!name && name.split('.').length > 2
  const enabled = !!name && isSubname

  const queryKey = useQueryKeys().hasSubnames(name)

  const {
    data: hasSubnames,
    isLoading,
    isFetched,
    isFetchedAfterMount,
    status,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching: _isFetching,
  } = useQuery(
    queryKey,
    async () => {
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
    },
    {
      enabled,
    },
  )

  return {
    hasSubnames,
    isLoading,
    isCachedData: enabled && status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
