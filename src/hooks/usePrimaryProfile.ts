import { Profile } from '@app/types'
import { useEffect, useState } from 'react'
import { usePrimary } from './usePrimary'
import { useProfile } from './useProfile'

export const usePrimaryProfile = (address: string, skip?: any) => {
  const {
    name: _name,
    loading: primaryLoading,
    status: primaryStatus,
  } = usePrimary(address || '', skip)

  const {
    profile: _profile,
    loading: profileLoading,
    status: profileStatus,
  } = useProfile(_name || '', skip)

  const [profile, setProfile] = useState<Profile | undefined>(undefined)
  useEffect(() => {
    let mounted = true
    if (_name && _profile && mounted) {
      setProfile({
        ..._profile,
        name: _name,
      })
    } else if (mounted) setProfile(undefined)
    return () => {
      mounted = false
    }
  }, [_name, _profile])

  return {
    profile,
    loading: primaryLoading || profileLoading,
    status: primaryStatus === 'error' ? primaryStatus : profileStatus,
  }
}
