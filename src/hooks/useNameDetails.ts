import { useEns } from '@app/utils/EnsProvider'
import { truncateFormat } from '@ensdomains/ensjs/dist/cjs/utils/format'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useProfile } from './useProfile'
import { useValidate } from './useValidate'

export const useNameDetails = (name: string) => {
  const [error, setError] = useState<string | null>(null)

  const { ready, getOwner, getExpiry, batch } = useEns()

  const { name: normalisedName, valid, labelCount } = useValidate(name, !name)

  const { profile, loading: profileLoading } = useProfile(
    normalisedName,
    !normalisedName,
  )

  const { data: batchData, isLoading: batchLoading } = useQuery(
    ['batch', 'getOwner', 'getExpiry', normalisedName],
    () =>
      labelCount > 2
        ? Promise.all([getOwner(normalisedName)])
        : batch(
            getOwner.batch(normalisedName),
            getExpiry.batch(normalisedName),
          ),
    {
      enabled: !!(normalisedName && valid),
    },
  )

  const ownerData = batchData?.[0] as Awaited<ReturnType<typeof getOwner>>
  const expiryData = batchData?.[1] as Awaited<ReturnType<typeof getExpiry>>

  const expiryDate = expiryData?.expiry

  const truncatedName = truncateFormat(normalisedName)

  useEffect(() => {
    if (valid && profile && profile.isMigrated && !profile.message) {
      setError(null)
    } else if (!valid) {
      setError('This name is invalid.')
    } else if (profile && !profile.isMigrated) {
      setError('This name is not migrated to the new registry.')
    } else if (profile && profile.message) {
      setError(profile.message)
    } else {
      setError('Unknown error.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, profile?.isMigrated, profile?.message])

  const isLoading = !ready || profileLoading || batchLoading

  return {
    error,
    normalisedName,
    valid,
    labelCount,
    profile,
    ownerData,
    expiryDate,
    isLoading,
    truncatedName,
  }
}
