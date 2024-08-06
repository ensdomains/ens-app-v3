import { useState } from 'react'
import { match, P } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { useProfile } from '@app/hooks/useProfile'
import { useVerifiedRecords } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { DentityView } from './views/DentityView'
import { VerificationOptionsList } from './views/VerificationOptionsList'

const VERIFICATION_PROTOCOLS = ['dentity'] as const

export type VerificationProtocol = (typeof VERIFICATION_PROTOCOLS)[number]

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const VerifyProfile = ({ data: { name }, dispatch, onDismiss }: Props) => {
  const [protocol, setProtocol] = useState<VerificationProtocol | null>(null)
  const { data: profile, isLoading: isProfileLoading } = useProfile({ name })

  const { address } = useAccount()

  const { data: verificationData, isLoading: isVerificationLoading } = useVerifiedRecords({
    name,
    address: profile?.coins?.find(({ id }) => id === 60)?.value,
    verificationsRecord: profile?.texts?.find(({ key }) => key === VERIFICATION_RECORD_KEY)?.value,
  })

  const isLoading = isProfileLoading || isVerificationLoading

  return (
    <>
      {match({ protocol, name, address, resolverAddress: profile?.resolverAddress, isLoading })
        .with({ isLoading: true }, () => <div>Loading</div>)
        .with(
          { protocol: 'dentity', name: P.not(P.nullish), resolverAddress: P.not(P.nullish) },
          ({ name: _name, address: _address, resolverAddress: _resolverAddress }) => (
            <DentityView
              name={_name}
              address={_address!}
              resolverAddress={_resolverAddress!}
              verified={!!verificationData?.some(({ issuer }) => issuer === 'dentity')}
              dispatch={dispatch}
              onBack={() => setProtocol(null)}
            />
          ),
        )
        .otherwise(() => (
          <VerificationOptionsList
            verificationData={verificationData}
            onSelect={setProtocol}
            onDismiss={onDismiss}
          />
        ))}
    </>
  )
}

export default VerifyProfile
