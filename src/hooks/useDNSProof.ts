import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { DNS_OVER_HTTP_ENDPOINT } from '@ensdomains/ensjs/functions/importDNSSECName'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

const useDNSProof = (name: string, skip?: any) => {
  const {
    data: fetchedData,
    status,
    isFetched,
    isLoading,
    isFetchedAfterMount,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
  } = useQuery(
    useQueryKeys().getDNSProof(name),
    async () => {
      const { DNSProver } = await import('@ensdomains/dnsprovejs')
      const prover = DNSProver.create(DNS_OVER_HTTP_ENDPOINT)
      const result = await prover.queryWithProof('TXT', `_ens.${name}`)
      return result
    },
    {
      enabled: !skip,
      staleTime: 0,
      cacheTime: 0,
    },
  )

  const isCachedData = status === 'success' && isFetched && !isFetchedAfterMount

  const data = useMemo(() => (isCachedData ? undefined : fetchedData), [isCachedData, fetchedData])

  return {
    data,
    isLoading,
  }
}

export default useDNSProof
