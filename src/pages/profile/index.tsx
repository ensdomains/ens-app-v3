import ProfileContent from '@app/components/pages/profile/[name]/Profile'
import Registration from '@app/components/pages/profile/[name]/registration/Registration'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useAccount } from 'wagmi'

export default function Page() {
  const router = useRouter()
  const _name = router.query.name as string
  const isSelf = router.query.connected === 'true'

  const initial = useInitial()

  const { address, isConnecting, isReconnecting } = useAccount()
  const accountLoading = isConnecting || isReconnecting

  const primary = usePrimary(address as string, !address)
  const { name: ensName, loading: primaryLoading } = primary

  const name = isSelf && ensName ? ensName : _name

  const nameDetails = useNameDetails(name)
  const { isLoading: detailsLoading, registrationStatus } = nameDetails

  const isLoading = detailsLoading || primaryLoading || accountLoading || initial

  return (
    <>
      {registrationStatus === 'available' || registrationStatus === 'premium' ? (
        <Registration {...{ nameDetails, isLoading }} />
      ) : (
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
      )}
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
