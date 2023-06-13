import { useEffect, useState } from 'react'

import { Profile } from '@app/types'

import { usePrimary } from './usePrimary'
import { useProfile } from './useProfile'

export const usePrimaryProfile = (address: string, skip?: any) => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  const primary = usePrimary(address || '', skip)

  const {
    profile: primaryProfile,
    loading: profileLoading,
    status: profileStatus,
  } = useProfile(primary.data?.name || '', skip)

  useEffect(() => {
    let mounted = true
    if (primary.data?.name && primaryProfile && mounted) {
      setProfile({
        ...primaryProfile,
        name: primary.data?.name,
      })
    } else if (mounted) setProfile(undefined)
    return () => {
      mounted = false
    }
  }, [primary.data?.name, primaryProfile])

  return {
    profile,
    loading: primary.isLoading || profileLoading,
    status: primary.status === 'error' ? primary.status : profileStatus,
  }
}
