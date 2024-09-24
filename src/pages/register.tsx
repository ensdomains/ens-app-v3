import { ReactElement } from 'react'
import { useAccount, useChainId } from 'wagmi'

import Registration from '@app/components/pages/register/Registration'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useTransactionManager } from '@app/transaction/transactionManager'

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

  const getCurrentRegistrationFlowStep = useTransactionManager(
    (s) => s.getCurrentRegistrationFlowStep,
  )

  const isLoading = detailsLoading || initial

  if (!isLoading && registrationStatus !== 'available' && registrationStatus !== 'premium') {
    let redirect = true

    if (nameDetails.ownerData?.owner === address && !!address) {
      const step = getCurrentRegistrationFlowStep(nameDetails.normalisedName, {
        account: address!,
        sourceChainId: chainId,
      })
      if (step === 'transactions' || step === 'complete') redirect = false
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
