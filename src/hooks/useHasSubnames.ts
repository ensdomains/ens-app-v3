import { useQuery } from 'wagmi'

import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { emptyAddress } from '../utils/constants'
import { useGlobalErrorFunc } from './errors/useGlobalErrorFunc'

const FETCH_PAGE_SIZE = 50

type Subnames = ReturnedENS['getSubnames']['subnames']

export const useHasSubnames = (name: string) => {
  const { getSubnames, ready } = useEns()

  const isSubname = name && name.split('.').length > 2
  const enabled = !!(ready && name && isSubname)

  const queryKey = useQueryKeys().hasSubnames(name)
  const watchedGetSubnames = useGlobalErrorFunc({
    queryKey,
    func: getSubnames,
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
  } = useQuery(
    queryKey,
    async () => {
      let cursor: Subnames = []
      let done = false

      while (!done) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const result = await watchedGetSubnames({
            name,
            lastSubnames: cursor,
            orderBy: 'labelName',
            orderDirection: 'desc',
            pageSize: FETCH_PAGE_SIZE,
          })
          const { subnames } = result || { subnames: [] }
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
