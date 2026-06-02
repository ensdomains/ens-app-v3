import { ReactElement } from 'react'
import { useAccount, useChainId } from 'wagmi'

import Registration from '@app/components/pages/profile/[name]/registration/Registration'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { getSelectedIndex } from '@app/hooks/useRegistrationReducer'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { ContentGrid } from '@app/layouts/ContentGrid'

export default function Page() {
  const router = useRouterWithHistory()
  // Derive name from query or path
  const name =
    (router.query.name as string) || router.asPath.replace('/register', '').replace('/', '')

  const initial = useInitial()

  const { address } = useAccount()
  const chainId = useChainId()

  const nameDetails = useNameDetails({ name })
  const { isLoading: detailsLoading, registrationStatus } = nameDetails

  const isLoading = detailsLoading || initial

  // 'short' = the label is shorter than the controller's minCharLength.
  // Stay on /register so the SimplexInfoPanel can show the yellow min-chars
  // warning and the Pricing step's Next button stays disabled. Without this,
  // the page silently redirects to /profile/<name> which makes the name
  // look registered when it isn't.
  const stayOnRegister =
    registrationStatus === 'available' ||
    registrationStatus === 'premium' ||
    registrationStatus === 'short'

  if (!isLoading && !stayOnRegister) {
    let redirect = true

    if (nameDetails.ownerData?.owner === address && !!address) {
      const registrationData = JSON.parse(
        localStorage.getItem('registration-status') || '{"items":[]}',
      )
      const index = getSelectedIndex(registrationData, {
        address: address!,
        name: nameDetails.normalisedName,
        chainId,
      })
      if (index !== -1) {
        const { stepIndex, queue } = registrationData.items[index]
        const step = queue[stepIndex]
        if (step === 'transactions' || step === 'complete') {
          redirect = false
        }
      }
    }

    if (redirect) {
      router.push(`/profile/${name}`)
    }
  }

  return <Registration {...{ nameDetails, isLoading }} />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
