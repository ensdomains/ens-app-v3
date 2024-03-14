import { useMemo } from 'react'
import { Hex } from 'viem'

import { usePrimaryName } from './ensjs/public/usePrimaryName'
import { useProfile } from './useProfile'

type UsePrimaryProfileParameters = {
  address?: Hex

  enabled?: boolean
}

export const usePrimaryProfile = ({ address, enabled = true }: UsePrimaryProfileParameters) => {
  const {
    data: primary,
    isLoading: isPrimaryLoading,
    isFetching: isPrimaryFetching,
  } = usePrimaryName({ address, enabled })

  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useProfile({ name: primary?.name })

  const data = useMemo(() => {
    if (!primary && !profile) return undefined
    return {
      name: primary?.name,
      ...profile,
    }
  }, [primary, profile])

  return {
    data,
    isLoading: isPrimaryLoading || isProfileLoading,
    isFetching: isPrimaryFetching || isProfileFetching,
  }
}
