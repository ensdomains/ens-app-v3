import { useState } from 'react'
import { match } from 'ts-pattern'

import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { useOwner } from '@app/hooks/ensjs/public/useOwner'
import { useProfile } from '@app/hooks/useProfile'
import { useVerifiedRecords } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { SearchViewLoadingView } from '../SendName/views/SearchView/views/SearchViewLoadingView'
import { VerificationOptionsList } from './views/VerificationOptionsList'

// Available verification protocols - empty array allows for future extensibility
const VERIFICATION_PROTOCOLS = [] as const

export type VerificationProtocol = (typeof VERIFICATION_PROTOCOLS)[number]

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const VerifyProfile = ({ data: { name }, onDismiss }: Props) => {
  const [protocol] = useState<VerificationProtocol | null>(null)
  const { data: profile, isLoading: isProfileLoading } = useProfile({ name })

  const { data: ownerData, isLoading: isOwnerLoading } = useOwner({ name })
  const ownerAddress = ownerData?.registrant ?? ownerData?.owner

  const { data: verificationData, isLoading: isVerificationLoading } = useVerifiedRecords({
    verificationsRecord: profile?.texts?.find(({ key }) => key === VERIFICATION_RECORD_KEY)?.value,
    ownerAddress,
    name,
  })

  const isLoading = isProfileLoading || isVerificationLoading || isOwnerLoading

  return (
    <>
      {match({
        protocol,
        isLoading,
      })
        .with({ isLoading: true }, () => <SearchViewLoadingView />)
        .otherwise(() => (
          <VerificationOptionsList verificationData={verificationData} onDismiss={onDismiss} />
        ))}
    </>
  )
}

export default VerifyProfile
