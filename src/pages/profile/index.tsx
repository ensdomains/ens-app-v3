import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useAccount } from 'wagmi'

import ProfileContent from '@app/components/pages/profile/[name]/Profile'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import { useRegistrationStatus } from '@app/hooks/useRegistrationStatus'
import { ContentGrid } from '@app/layouts/ContentGrid'

const isDNSName = (name: string): boolean => {
  const labels = name?.split('.')

  return !!labels && labels[labels.length - 1] !== 'eth'
}

export default function Page() {
  const router = useRouter()
  const _name = router.query.name as string
  const isSelf = router.query.connected === 'true'

  const { data: status } = useRegistrationStatus(_name)

  const initial = useInitial()

  const { address, isConnecting, isReconnecting } = useAccount()
  const accountLoading = isConnecting || isReconnecting

  const primary = usePrimary(address as string, !address)
  const { name: ensName, loading: primaryLoading } = primary

  const name = isSelf && ensName ? ensName : _name

  const nameDetails = useNameDetails(name)
  const { isLoading: detailsLoading, registrationStatus } = nameDetails

  const isLoading = detailsLoading || primaryLoading || accountLoading || initial

  if (registrationStatus === 'available' || registrationStatus === 'premium') {
    router.push(`/register/${name}`)
    return null
  }

  const isDNS = isDNSName(name)
  if (isDNS && status === 'notImported') {
    router.push(`/import/${name}`)
    return null
  }

  return (
    <ProfileContent
      {...{
        nameDetails,
        primary,
        isSelf,
        isLoading,
        _name,
        name,
      }}
    />
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
