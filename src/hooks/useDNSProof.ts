import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { DNS_OVER_HTTP_ENDPOINT } from '@ensdomains/ensjs/functions/importDNSSECName'

const useDNSProof = (name: string, skip?: any) => {
  const {
    data: fetchedData,
    status,
    isFetched,
    isLoading,
    internal: { isFetchedAfterMount },
  } = useQuery(
    ['getDNSProof', name],
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
