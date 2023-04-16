import { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { Profile, ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { contentHashToString } from '@app/utils/contenthash'

import { useContractAddress } from './useContractAddress'

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
  const [dummy, setDummy] = useState(false)
  const { ready, getProfile } = useEns()

  // Profile resolver address check
  const latestResolverAddress = useContractAddress('PublicResolver')

  const profileResolverAddress = profile?.resolverAddress

  const { data, isLoading, isFetching } = useQuery(
    ['resolverStatus', name, { profileResolverAddress, options }],
    async () => {
      if (!profileResolverAddress)
        return {
          hasResolver: false,
          hasLatestResolver: false,
          hasMigratedProfile: false,
          isMigratedProfileEqual: false,
        }
      if (profileResolverAddress === latestResolverAddress)
        return {
          hasResolver: true,
          hasLatestResolver: true,
          hasMigratedProfile: true,
          isMigratedProfileEqual: true,
        }
      if (options?.skipCompare)
        return {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: false,
          isMigratedProfileEqual: false,
        }

      const resolverProfile = await getProfile(name, {
        resolverAddress: latestResolverAddress,
      })

      const resolverRecords = resolverProfile?.records || {}

      if (Object.keys(resolverRecords).length === 0)
        return {
          hasResolver: true,
          hasLatestResolver: false,
          hasMigratedProfile: false,
          isMigratedProfileEqual: false,
        }

      return {
        hasResolver: true,
        hasLatestResolver: false,
        hasMigratedProfile: true,
        isMigratedProfileEqual: areRecordsEqual(profile?.records, resolverRecords),
      }
    },
    {
      enabled: ready && !skip,
      onSettled: () => setDummy((d) => !d),
    },
  )

  // why does this work?
  // idk, but it does
  // (something something react lifecycle re-render logic, apparently this is fixed in react 18)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ({ data, isLoading, isFetching }), [dummy])
}
