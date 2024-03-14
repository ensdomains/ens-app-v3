import { useMemo } from 'react'
import type { Address } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { GetDnsOffchainDataReturnType } from '@ensdomains/ensjs/dns'

import { checkDnsAddressMatch, checkDnsError } from '@app/components/pages/import/[name]/utils'
import { EXTENDED_DNS_RESOLVER_MAP } from '@app/constants/resolverAddressData'

import { useDnsOffchainData } from '../ensjs/dns/useDnsOffchainData'
import { useAddressRecord } from '../ensjs/public/useAddressRecord'

type UseDnsOffchainStatusParameters = {
  name?: string
  enabled?: boolean
}

const getOffchainDnsResolverStatus = ({
  chainId,
  dnsOffchainData,
}: {
  chainId: number
  dnsOffchainData: GetDnsOffchainDataReturnType | undefined
}) => {
  if (!dnsOffchainData) return null
  if (dnsOffchainData.resolverAddress === EXTENDED_DNS_RESOLVER_MAP[String(chainId)]) {
    return 'matching' as const
  }
  return 'mismatching' as const
}

export const useDnsOffchainStatus = ({ name, enabled = true }: UseDnsOffchainStatusParameters) => {
  const chainId = useChainId()
  const { address } = useAccount()

  const {
    data: dnsOffchainData,
    error: dnsOffchainError,
    isLoading: isDnsOffchainDataLoading,
    isCachedData: isDnsOffchainDataCachedData,
    isError,
    isRefetching,
    dataUpdatedAt,
    errorUpdatedAt,
    refetch,
  } = useDnsOffchainData({
    name,
    enabled,
    strict: true,
  })

  const {
    data: addressRecord,
    isLoading: isAddressRecordLoading,
    isCachedData: isAddressRecordCachedData,
  } = useAddressRecord({
    name,
    enabled: enabled && !!dnsOffchainData,
  })

  const isLoading = isDnsOffchainDataLoading || isAddressRecordLoading
  const isCachedData = isDnsOffchainDataCachedData || isAddressRecordCachedData

  const data = useMemo(() => {
    if (isLoading || isError) return undefined
    const resolverStatus = getOffchainDnsResolverStatus({ chainId, dnsOffchainData })
    const addressStatus = checkDnsAddressMatch({
      address,
      dnsAddress: addressRecord?.value as Address | undefined | null,
    })
    return {
      resolver: resolverStatus
        ? {
            status: resolverStatus,
            value: dnsOffchainData?.resolverAddress,
          }
        : null,
      address: addressStatus
        ? {
            status: addressStatus,
            value: addressRecord?.value as Address | undefined | null,
          }
        : null,
    }
  }, [isLoading, isError, chainId, dnsOffchainData, address, addressRecord])

  const error = useMemo(() => {
    if (isLoading) return null
    if (isError) return checkDnsError({ error: dnsOffchainError, isLoading })
    if (!addressRecord?.value) return 'resolutionFailure'
    return null
  }, [isError, dnsOffchainError, isLoading, addressRecord])

  return {
    data,
    error,
    isLoading,
    isCachedData,
    isError,
    isRefetching,
    dataUpdatedAt,
    errorUpdatedAt,
    refetch,
  }
}
