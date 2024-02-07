import { useMemo } from 'react'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'

import { GetDnsOffchainDataReturnType } from '@ensdomains/ensjs/dns'

import { checkDnsAddressMatch, checkDnsError } from '@app/components/pages/import/[name]/utils'

import { useChainId } from '../chain/useChainId'
import { useDnsOffchainData } from '../ensjs/dns/useDnsOffchainData'
import { useAddressRecord } from '../ensjs/public/useAddressRecord'

type UseDnsOffchainStatusParameters = {
  name?: string
  enabled?: boolean
}

/* eslint-disable @typescript-eslint/naming-convention */
export const extendedDnsResolverAddress = {
  '1': '0x238A8F792dFA6033814B18618aD4100654aeef01',
  '17000': '0xB0c003d54e7c5a30C0dF72c0D43Df5876d457618',
  '11155111': '0x0EF1aF80c24B681991d675176D9c07d8C9236B9a',
} as const
/* eslint-enable @typescript-eslint/naming-convention */

const getOffchainDnsResolverStatus = ({
  chainId,
  dnsOffchainData,
}: {
  chainId: number
  dnsOffchainData: GetDnsOffchainDataReturnType | undefined
}) => {
  if (!dnsOffchainData) return null
  if (
    dnsOffchainData.resolverAddress ===
    extendedDnsResolverAddress[String(chainId) as keyof typeof extendedDnsResolverAddress]
  ) {
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
    internal: { dataUpdatedAt, errorUpdatedAt },
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
