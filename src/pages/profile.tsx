import type { Hex } from 'viem'
import { useAccount } from 'wagmi'

import ProfileContent from '@app/components/pages/profile/[name]/Profile'
import { useDotBoxAvailabilityOffchain } from '@app/hooks/dotbox/useDotBoxAvailabilityOffchain'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { checkDNS2LDFromName } from '@app/utils/utils'

export default function Page() {
  const router = useRouterWithHistory()
  const _name = router.query.name as string
  const isSelf = router.query.connected === 'true'
  const isViewingExpired = router.query.expired === 'true'

  const initial = useInitial()

  const { address } = useAccount()

  const dotBoxResult = useDotBoxAvailabilityOffchain({
    name: _name,
  })

  const primary = usePrimaryName({ address: address as Hex })

  const name = isSelf && primary.data?.name ? primary.data.name : _name

  // Skip graph for for initial load and router redirect
  const nameDetails = useNameDetails({ name })
  const {
    isBasicLoading,
    isProfileLoading,
    isDnsOwnerLoading,
    registrationStatus,
    gracePeriodEndDate,
  } = nameDetails

  const isLoading =
    isBasicLoading ||
    isProfileLoading ||
    primary.isLoading ||
    initial ||
    !router.isReady ||
    dotBoxResult.isLoading

  if (
    dotBoxResult?.data?.data.status === 'AVAILABLE' ||
    dotBoxResult?.data?.data.status === 'UNAVAILABLE'
  ) {
    router.push(`/dotbox/${name}`)
    return null
  }

  if (isViewingExpired && gracePeriodEndDate && gracePeriodEndDate > new Date()) {
    router.push(`/profile/${name}`)
    return null
  }

  if (
    (registrationStatus === 'available' || registrationStatus === 'premium') &&
    !isViewingExpired &&
    !isBasicLoading
  ) {
    router.push(`/register/${name}`)
    return null
  }

  const isDns = checkDNS2LDFromName(name)
  if (isDns && registrationStatus === 'notImported' && !isBasicLoading && !isDnsOwnerLoading) {
    router.push(`/import/${name}`)
    return null
  }

  return (
    <ProfileContent
      {...{
        isSelf,
        isLoading,
        name,
      }}
    />
  )
}
