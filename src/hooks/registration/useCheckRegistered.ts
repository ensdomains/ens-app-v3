import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Address } from 'viem'

import { useOwner } from '../ensjs/public/useOwner'
import { useWrapperData } from '../ensjs/public/useWrapperData'

export const useCheckRegistered = ({
  name,
  ownerAddress,
  enabled,
}: {
  name: string
  ownerAddress?: Address
  enabled: boolean
}) => {
  const active = !!ownerAddress && enabled
  const { data: owner } = useOwner({ name, enabled: active })
  const { data: wrapperData } = useWrapperData({
    name,
    enabled: active,
  })
  const queryClient = useQueryClient()

  const checkRegistered = owner?.registrant === ownerAddress || wrapperData?.owner === ownerAddress

  // We use an interval to invalidate the query instead of a retry just in case the owner or wrapper data has
  // residual data which would stop the fetch from retryingand also to avoid the retry limit
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (active && !checkRegistered) {
      interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: [{ name }] })
      }, 5000)
      // We don't need to clear the interval when checkRegistered is true because it will lead
      // to a page redirect and the unmounting of the component
      return () => interval && clearInterval(interval)
    }
  }, [active, name, queryClient, checkRegistered])

  return checkRegistered
}
