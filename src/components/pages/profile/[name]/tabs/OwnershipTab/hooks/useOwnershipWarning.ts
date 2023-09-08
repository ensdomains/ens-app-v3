import { useMemo } from 'react'

import { GroupedRoleRecord } from '@app/hooks/ownership/useRoles/useRoles'
import { useAccountSafely } from '@app/hooks/useAccountSafely'

type Input = {
  roles: GroupedRoleRecord[]
}

export const useOwnershipWarning = ({ roles }: Input) => {
  const account = useAccountSafely()
  const isLoading = !account.address
  const data = useMemo(() => {
    if (isLoading) return undefined
  }, [isLoading])
  console.log('roles', roles)
  // isRegistrant not manager
  // isManager not parent owner
  // is Manager not DNS owner
  // isDNSOwner but not manager

  return {
    data,
    isLoading,
  }
}
