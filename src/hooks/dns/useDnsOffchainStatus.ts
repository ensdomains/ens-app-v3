import { useMemo } from 'react'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'

import { GetDnsOffchainDataReturnType } from '@ensdomains/ensjs/dns'

import { checkDnsAddressMatch } from '@app/components/pages/import/[name]/utils'

import { useChainId } from '../chain/useChainId'
import { useDnsOffchainData } from '../ensjs/dns/useDnsOffchainData'

type UseDnsOffchainStatusParameters = {
  name?: string
  enabled?: boolean
}

export const offchainDnsAddress = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1': '0xF142B308cF687d4358410a4cB885513b30A42025',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '11155111': '0x179Be112b24Ad4cFC392eF8924DfA08C20Ad8583',
} as const

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
    offchainDnsAddress[String(chainId) as keyof typeof offchainDnsAddress]
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
    isLoading: isDnsOffchainDataLoading,
    isCachedData: isDnsOffchainDataCachedData,
    isError,
    error,
  } = useDnsOffchainData({
    name,
    enabled,
  })

  const isLoading = isDnsOffchainDataLoading
  const isCachedData = isDnsOffchainDataCachedData

  const data = useMemo(() => {
    if (isLoading || isError) return undefined
    return {
      resolver: getOffchainDnsResolverStatus({ chainId, dnsOffchainData }),
      address: checkDnsAddressMatch({
        address,
        dnsAddress: dnsOffchainData?.extraData as Address | undefined | null,
      }),
    }
  }, [isLoading, isError, chainId, dnsOffchainData, address])

  return {
    data,
    isLoading,
    isCachedData,
    isError,
    error,
  }
}
