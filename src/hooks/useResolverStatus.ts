import { usePublicResolverAddress } from '@app/hooks/usePublicResolverAddress'
import { useState, useEffect } from 'react'
import { useEns } from '@app/utils/EnsProvider'
import { Profile } from '@app/types'
import { contentHashToString } from '@app/utils/contenthash'
import { useProfile } from './useProfile'

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
  skipCompare: boolean
}

type Result = {
  status: {
    hasLatestResolver: boolean
    hasMigratedProfile: boolean
    hasCreatedProfile: boolean
  }
  loading: boolean
}

export const useResolverStatus = (name: string, skip?: boolean, options?: Options): Result => {
  // Profile resolver address check
  const { loading: resolverLoading, address: latestResolverAddress } = usePublicResolverAddress()

  const skipProfile = !name || skip
  const { profile, loading: profileLoading } = useProfile(name, skipProfile)
  const profileResolverAddress = profile?.resolverAddress

  const profileHasLatestResolverLoading = resolverLoading || profileLoading || !!skip
  const profileHasLatestResolver =
    !profileHasLatestResolverLoading && profileResolverAddress === latestResolverAddress

  // Compare to latest resolver
  const { getProfile, ready } = useEns()

  const shouldCompareResolvers =
    ready && !profileHasLatestResolverLoading && !profileHasLatestResolver

  const [compareResults, setCompareResults] = useState<Result['status']>({
    hasLatestResolver: false,
    hasMigratedProfile: false,
    hasCreatedProfile: false,
  })

  const [compareLoading, setCompareLoading] = useState(true)

  const compareResolvers = async () => {
    if (options?.skipCompare) {
      setCompareResults({
        hasLatestResolver: false,
        hasMigratedProfile: false,
        hasCreatedProfile: false,
      })
      setCompareLoading(false)
      return
    }

    const resolverProfile = await getProfile(name, { resolverAddress: latestResolverAddress })
    if (!resolverProfile) {
      setCompareResults({
        hasLatestResolver: false,
        hasMigratedProfile: false,
        hasCreatedProfile: false,
      })
      setCompareLoading(false)
      return
    }

    const recordsEqual = areRecordsEqual(profile?.records, resolverProfile?.records)

    setCompareResults({
      hasLatestResolver: false,
      hasMigratedProfile: recordsEqual,
      hasCreatedProfile: true,
    })
    setCompareLoading(false)
  }

  useEffect(() => {
    if (shouldCompareResolvers) {
      compareResolvers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCompareResolvers])

  // Set results
  const status: Result['status'] = profileHasLatestResolver
    ? { hasLatestResolver: true, hasMigratedProfile: true, hasCreatedProfile: true }
    : compareResults

  const loading = (() => {
    if (profileHasLatestResolverLoading) return true
    if (!profileHasLatestResolverLoading && profileHasLatestResolver) return false
    return compareLoading
  })()

  return {
    status,
    loading,
  }
}
