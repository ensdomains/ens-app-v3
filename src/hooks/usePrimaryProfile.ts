import { useMemo } from 'react'

import { usePrimary } from './usePrimary'
import { useProfile } from './useProfile'

export const usePrimaryProfile = (address: string, skip?: any) => {
  const primary = usePrimary(address || '', skip)

  const primaryProfile = useProfile(primary.data?.name || '', { enabled: !skip })

  const isLoading = primary.isLoading || primaryProfile.isLoading
  const isFetching = primary.isFetching || primaryProfile.isFetching
  const isError = primary.isError || primaryProfile.isError

  const data = useMemo(() => {
    if (isLoading) return null
    return {
      name: primary.data?.name,
      ...(primaryProfile.data || {}),
    }
  }, [isLoading, primary.data, primaryProfile.data])

  return {
    data,
    isLoading,
    isError,
    isFetching,
    status: primary.status === 'error' ? primary.status : primaryProfile.status,
  }
}
