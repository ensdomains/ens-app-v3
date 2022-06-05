import { usePrimary } from './usePrimary'
import { useProfile } from './useProfile'

export const usePrimaryProfile = (address: string, skip?: any) => {
  const {
    name,
    loading: primaryLoading,
    status: primaryStatus,
  } = usePrimary(address || '', skip)

  const {
    profile,
    loading: profileLoading,
    status: profileStatus,
  } = useProfile(name || '', skip)

  return {
    profile,
    loading: primaryLoading || profileLoading,
    status: primaryStatus === 'error' ? primaryStatus : profileStatus,
  }
}
