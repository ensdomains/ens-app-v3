import { Profile } from '@app/types'
import { useEffect, useState } from 'react'
import { usePrimary } from './usePrimary'
import { useProfile } from './useProfile'

export const usePrimaryProfile = (address: string, skip?: any) => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  const { name: primaryName, loading: primaryLoading, status: primaryStatus } = usePrimary(address || '', skip)

  const {
    profile: primaryProfile,
    loading: profileLoading,
    status: profileStatus,
  } = useProfile(primaryName || '', skip)

  useEffect(() => {
    let mounted = true
    if (primaryName && primaryProfile && mounted) {
      setProfile({
        ...primaryProfile,
        name: primaryName,
      })
    } else if (mounted) setProfile(undefined)
    return () => {
      mounted = false
    }
  }, [primaryName, primaryProfile])

  return {
    profile,
    loading: primaryLoading || profileLoading,
    status: primaryStatus === 'error' ? primaryStatus : profileStatus,
  }
}
