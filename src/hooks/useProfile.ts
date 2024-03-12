import { useMemo } from 'react'
import type { Address } from 'viem'

import { getCoderByCoinName, getCoderByCoinType } from '@ensdomains/address-encoder'

import { supportedAddresses } from '@app/constants/supportedAddresses'
import { supportedGeneralRecordKeys } from '@app/constants/supportedGeneralRecordKeys'
import { supportedSocialRecordKeys } from '@app/constants/supportedSocialRecordKeys'

import { usePrefetchRecords, useRecords } from './ensjs/public/useRecords'
import { useDecodedName } from './ensjs/subgraph/useDecodedName'
import {
  useSubgraphRecords,
  UseSubgraphRecordsReturnType,
} from './ensjs/subgraph/useSubgraphRecords'

type UseProfileParameters = {
  name?: string
  enabled?: boolean
  resolverAddress?: Address
  subgraphEnabled?: boolean
}

const getProfileRecordsParameters = ({
  name,
  resolverAddress,
  subgraphRecords,
}: {
  name?: string
  resolverAddress?: Address
  subgraphRecords?: UseSubgraphRecordsReturnType
}) =>
  ({
    name,
    resolver: resolverAddress
      ? {
          address: resolverAddress,
          fallbackOnly: false,
        }
      : undefined,
    texts: [
      ...new Set([
        ...supportedSocialRecordKeys,
        ...supportedGeneralRecordKeys,
        ...(subgraphRecords?.texts || []),
      ]),
    ] as [string, ...string[]],
    coins: [
      ...new Set([
        ...supportedAddresses.map((coinName) => getCoderByCoinName(coinName).coinType),
        ...(subgraphRecords?.coins
          .map((coinId) => parseInt(coinId))
          .filter((coinId) => {
            try {
              return !!getCoderByCoinType(coinId)
            } catch {
              return false
            }
          }) || []),
      ]),
    ] as [number, ...number[]],
    abi: true,
    contentHash: true,
  }) as const

export const useProfile = ({
  name,
  resolverAddress,
  subgraphEnabled = true,
  enabled = true,
}: UseProfileParameters) => {
  const {
    data: subgraphRecords,
    isFetching: isSubgraphRecordsFetching,
    refetchIfEnabled: refetchSubgraphRecords,
  } = useSubgraphRecords({ name, resolverAddress, enabled: enabled && subgraphEnabled })

  const {
    data: profile,
    isLoading: isProfileLoading,
    isCachedData: isProfileCachedData,
    isPlaceholderData: isPlaceholderProfile,
    isFetching: isProfileFetching,
    refetchIfEnabled: refetchProfile,
  } = useRecords({
    ...getProfileRecordsParameters({ name, resolverAddress, subgraphRecords }),
    enabled: enabled && !!name,
    keepPreviousData: true,
  })

  const { data: decodedName } = useDecodedName({
    name,
    allowIncomplete: true,
    enabled: enabled && !!name && !!profile,
  })

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
    // we only need to depend on profile for loading/cached state because subgraph records are not required to load the profile
    isLoading: isProfileLoading,
    isCachedData: isProfileCachedData || isPlaceholderProfile,
    isFetching: isSubgraphRecordsFetching || isProfileFetching,
    refetchIfEnabled: () => {
      refetchSubgraphRecords()
      refetchProfile()
    },
  }
}

export const usePrefetchProfile = ({ name }: { name: string }) => {
  const { data: subgraphRecords } = useSubgraphRecords({ name })
  usePrefetchRecords(getProfileRecordsParameters({ name, subgraphRecords }))
}
