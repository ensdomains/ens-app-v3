import { useMemo } from 'react'

import { Profile, ReturnedENS } from '@app/types'
import { contentHashToString } from '@app/utils/contenthash'
import { canEditRecordsWhenWrappedCalc } from '@app/utils/utils'

import { emptyAddress } from '../utils/constants'
import { useChainId } from './useChainId'
import { useContractAddress } from './useContractAddress'
import { useProfile } from './useProfile'
import { useResolverIsAuthorized } from './useResolverIsAuthorized'

const areRecordsEqual = (a: Profile['records'], b: Profile['records']): boolean => {
  const areTextsEqual = Object.values(
    [...(a?.texts || []), ...(b?.texts || [])].reduce<{
      [key: string]: number
    }>((acc, text) => {
      const key = `${text.key}-${text.value}`
      if (acc[key]) acc[key] += 1
      else acc[key] = 1
      return acc
    }, {}),
  ).every((count) => count === 2)
  if (!areTextsEqual) return false

  const areCoinTypesEqual = Object.values(
    [...(a?.coinTypes || []), ...(b?.coinTypes || [])].reduce<{
      [key: string]: number
    }>((acc, coinType) => {
      const key = `${coinType.coin}-${(coinType as any).addr}`
      if (acc[key]) acc[key] += 1
      else acc[key] = 1
      return acc
    }, {}),
  ).every((count) => count === 2)
  if (!areCoinTypesEqual) return false

  const isContentHashEqual = (() => {
    const contentHashA = contentHashToString(a?.contentHash)
    const contentHashB = contentHashToString(b?.contentHash)
    return contentHashA === contentHashB
  })()

  if (!isContentHashEqual) return false
  return true
}

type Options = {
  skip?: boolean
  skipCompare?: boolean
}

export const useResolverStatus = (
  name: string,
  profile: ReturnedENS['getProfile'],
  { skip, ...options }: Options = {},
) => {
  const chainId = useChainId()
  const { data: isAuthorized, isLoading: isAuthorizedLoading } = useResolverIsAuthorized(
    name,
    profile?.resolverAddress,
  )

  const latestResolverAddress = useContractAddress('PublicResolver')
  const { profile: latestResolverProfile, loading: isLatestResolverProfileLoading } = useProfile(
    name,
    options.skipCompare,
    latestResolverAddress,
  )

  const profileResolverAddress = profile?.resolverAddress

  return useMemo(() => {
    const defaultResults = {
      hasResolver: false,
      hasLatestResolver: false,
      hasValidResolver: false,
      hasMigratedProfile: false,
      isMigratedProfileEqual: false,
      isNameWrapperAware: false,
    }

    if (!profileResolverAddress || profileResolverAddress === emptyAddress)
      return {
        status: defaultResults,
        isLoading: false,
      }

    const baseResults = {
      ...defaultResults,
      hasResolver: true,
      hasLatestResolver: profileResolverAddress === latestResolverAddress,
      isNameWrapperAware: canEditRecordsWhenWrappedCalc(true, profileResolverAddress, chainId),
      hasValidResolver: !!isAuthorized,
    }

    if (!isAuthorizedLoading && (baseResults.hasLatestResolver || options?.skipCompare))
      return {
        status: baseResults,
        isLoading: false,
      }

    const resolverRecords = latestResolverProfile?.records || {}
    const keys = ['texts', 'coinTypes', 'contentHash'] as const
    const hasMigratedProfile = keys.some((key) => {
      if (!resolverRecords[key]) return false
      if (key === 'contentHash') return !!resolverRecords[key]
      const arrayValue = resolverRecords[key]?.length || 0
      return arrayValue > 0
    })

    if (!isLatestResolverProfileLoading)
      return {
        status: {
          ...baseResults,
          hasMigratedProfile,
          isMigratedProfileEqual: areRecordsEqual(profile?.records, resolverRecords),
        },
        isLoading: false,
      }

    return {
      status: undefined,
      isLoading: true,
    }
  }, [
    chainId,
    isAuthorized,
    isAuthorizedLoading,
    isLatestResolverProfileLoading,
    latestResolverAddress,
    latestResolverProfile,
    options?.skipCompare,
    profile?.records,
    profileResolverAddress,
  ])
}
