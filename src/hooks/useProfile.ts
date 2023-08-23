import { useMemo } from 'react'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'

import type { Address } from 'viem'
import { useRecords } from './ensjs/public/useRecords'
import { useDecodedName } from './ensjs/subgraph/useDecodedName'
import { useSubgraphRecords } from './ensjs/subgraph/useSubgraphRecords'

type UseProfileParameters = {
  name: string
  enabled?: boolean
  resolverAddress?: Address
  subgraphEnabled?: boolean
}

export const useProfile = (
  { name, resolverAddress, subgraphEnabled = true, enabled = true }: UseProfileParameters,
) => {
  const { data: subgraphRecords, isLoading: isSubgraphRecordsLoading, isCachedData: isSubgraphRecordsCachedData } = useSubgraphRecords({ name, resolverAddress, enabled: enabled && subgraphEnabled })

  const { data: profile, isLoading: isProfileLoading, isCachedData: isProfileCachedData } = useRecords(
    {
      name,
      resolver: resolverAddress ? {
        address: resolverAddress,
        fallbackOnly: false,
      } : undefined,
      records: {
        texts: [...supportedTexts, ...supportedProfileItems, ...(subgraphRecords?.texts || [])],
        coins: [...supportedAddresses, ...(subgraphRecords?.coins || [])],
        abi: true,
        contentHash: true,
      },
      enabled: enabled && !!name,
    },
  )

  const { data: decodedName } = useDecodedName({ name, enabled: enabled && !!name && !!profile })

  const returnProfile = useMemo(() => {
    if (!profile) return undefined
    return {
      ...profile,
      ...(decodedName ? {
        decodedName,
      } : {}),
      isMigrated: subgraphRecords?.isMigrated,
      createdAt: subgraphRecords?.createdAt,
    }
  }, [profile, subgraphRecords, decodedName])

  return {
    data: returnProfile,
    isLoading: isSubgraphRecordsLoading || isProfileLoading,
    isCachedData: isSubgraphRecordsCachedData && isProfileCachedData,
  }
}
