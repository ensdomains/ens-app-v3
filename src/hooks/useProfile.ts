import { useMemo } from 'react'
import type { Address } from 'viem'

import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'

import { useRecords } from './ensjs/public/useRecords'
import { useDecodedName } from './ensjs/subgraph/useDecodedName'
import { useSubgraphRecords } from './ensjs/subgraph/useSubgraphRecords'

type UseProfileParameters = {
  name?: string
  enabled?: boolean
  resolverAddress?: Address
  subgraphEnabled?: boolean
}

export const useProfile = ({
  name,
  resolverAddress,
  subgraphEnabled = true,
  enabled = true,
}: UseProfileParameters) => {
  const {
    data: subgraphRecords,
    isLoading: isSubgraphRecordsLoading,
    isCachedData: isSubgraphRecordsCachedData,
    isFetching: isSubgraphRecordsFetching,
  } = useSubgraphRecords({ name, resolverAddress, enabled: enabled && subgraphEnabled })

  const {
    data: profile,
    isLoading: isProfileLoading,
    isCachedData: isProfileCachedData,
    isFetching: isProfileFetching,
  } = useRecords({
    name,
    resolver: resolverAddress
      ? {
          address: resolverAddress,
          fallbackOnly: false,
        }
      : undefined,
    records: {
      texts: [
        ...new Set([
          ...supportedTexts,
          ...supportedProfileItems,
          ...(subgraphRecords?.texts || []),
        ]),
      ],
      coins: [
        ...new Set([
          ...supportedAddresses.map((coinName) => formatsByName[coinName.toUpperCase()].coinType),
          ...(subgraphRecords?.coins
            .map((coinId) => parseInt(coinId))
            .filter((coinId) => !!formatsByCoinType[coinId]) || []),
        ]),
      ],
      abi: true,
      contentHash: true,
    },
    enabled: enabled && !!name,
  })

  const { data: decodedName } = useDecodedName({ name, enabled: enabled && !!name && !!profile })

  const returnProfile = useMemo(() => {
    if (!profile) return undefined
    return {
      ...profile,
      ...(decodedName
        ? {
            decodedName,
          }
        : {}),
      isMigrated: subgraphRecords?.isMigrated,
      createdAt: subgraphRecords?.createdAt,
      address: profile.coins.find((x) => x.id === 60)?.value as Address | undefined,
    }
  }, [profile, subgraphRecords, decodedName])

  return {
    data: returnProfile,
    isLoading: isSubgraphRecordsLoading || isProfileLoading,
    isCachedData: isSubgraphRecordsCachedData && isProfileCachedData,
    isFetching: isSubgraphRecordsFetching || isProfileFetching,
  }
}
