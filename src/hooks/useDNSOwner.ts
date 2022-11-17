import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

const useDNSOwner = (name: string, valid: boolean | undefined) => {
  const { ready, getDNSOwner } = useEns()

  const {
    data: dnsOwner,
    status,
    isFetched,
    isLoading,
    internal: { isFetchedAfterMount },
  } = useQuery(['getDNSOwner', name], () => getDNSOwner(name), {
    enabled: ready && valid && !name?.endsWith('.eth'),
  })

  const isCachedData = status === 'success' && isFetched && !isFetchedAfterMount

  return {
    dnsOwner,
    isCachedData,
    isLoading,
  }
}

export default useDNSOwner
