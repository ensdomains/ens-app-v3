import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import type { VerificationErrorDialogProps } from '@app/components/pages/VerificationErrorDialog'
import { DENTITY_ISS } from '@app/constants/verification'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import type { VerificationProtocol } from '@app/transaction/user/input/VerifyProfile/VerifyProfile-flow'

import { useVerificationOAuth } from '../useVerificationOAuth/useVerificationOAuth'
import { dentityVerificationHandler } from './utils/dentityHandler'

const issToVerificationProtocol = (iss: string | null): VerificationProtocol | null => {
  if (iss === DENTITY_ISS) return 'dentity'
  return null
}

type UseVerificationOAuthHandlerReturnType = {
  dialogProps: VerificationErrorDialogProps
}

export const useVerificationOAuthHandler = (): UseVerificationOAuthHandlerReturnType => {
  const searchParams = useSearchParams()
  const iss = searchParams.get('iss')
  const code = searchParams.get('code')
  const router = useRouterWithHistory()

  const { address: userAddress } = useAccount()

  const isReady = !!router && !!userAddress && !!iss && !!code

  const { data, isLoading, error } = useVerificationOAuth({
    verifier: issToVerificationProtocol(iss),
    code,
    enabled: isReady,
  })

  const [dialogProps, setDialogProps] = useState<VerificationErrorDialogProps>()
  const onClose = () => setDialogProps(undefined)
  const onDismiss = () => setDialogProps(undefined)

  useEffect(() => {
    if (data && !isLoading && userAddress) {
      const newProps = match(data)
        .with(
          {
            verifier: 'dentity',
          },
          dentityVerificationHandler({
            userAddress,
            onClose,
            onDismiss,
            router,
          }),
        )
        .otherwise(() => undefined)
      setDialogProps(newProps)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, error])

  return {
    dialogProps,
  }
}
