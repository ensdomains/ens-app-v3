import { useMemo } from 'react'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'

export const usePccExpired = ({ ownerData }: { ownerData: GetOwnerReturnType | undefined }) => {
  return useMemo(() => {
    return !!(ownerData?.ownershipLevel === 'registry')
  }, [ownerData])
}
