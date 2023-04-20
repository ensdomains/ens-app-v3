import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

const useDNSOwner = (name: string, valid: boolean | undefined) => {
  const { ready, getDNSOwner } = useEns()

  const {
    data: dnsOwner,
    status,
    isFetched,
    isLoading,
    isFetchedAfterMount,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
  } = useQuery(
    useQueryKeys().getDNSOwner(name),
    () =>
      getDNSOwner(name)
        .then((d) => d || null)
        .catch((e: any) => {
          if (e && e.message === 'DNS query failed: NXDOMAIN') {
            // domain doesn't exist
            return null
          }
          throw e
        }),
    {
      enabled: ready && valid && !name?.endsWith('.eth') && name !== 'eth' && name !== '[root]',
    },
  )

  const isCachedData = status === 'success' && isFetched && !isFetchedAfterMount

  return {
    dnsOwner,
    isCachedData,
    isLoading,
  }
}

export default useDNSOwner
