import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import type { VerificationErrorDialogProps } from '@app/components/pages/VerificationErrorDialog'
import { DENTITY_ISS } from '@app/constants/verification'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { useDentityProfile } from '../useDentityProfile/useDentityProfile'
import { useDentityToken } from '../useDentityToken/useDentityToken'
import { dentityVerificationHandler } from './utils/dentityHandler'

type UseVerificationOAuthHandlerReturnType = {
  dialogProps: VerificationErrorDialogProps
}

export const useVerificationOAuthHandler = (): UseVerificationOAuthHandlerReturnType => {
  const searchParams = useSearchParams()
  const iss = searchParams.get('iss')
  const code = searchParams.get('code')
  const router = useRouterWithHistory()
  const { t } = useTranslation('common')
  const { createTransactionFlow } = useTransactionFlow()

  const { address: userAddress } = useAccount()

  const isReady = !!createTransactionFlow && !!router && !!iss && !!code && iss === DENTITY_ISS
  const { data: dentityToken, isLoading: isDentityTokenLoading } = useDentityToken({
    code,
    enabled: isReady,
  })

  const isReadyToFetchProfile = !!dentityToken && !isDentityTokenLoading
  const {
    data,
    isLoading: isDentityProfileLoading,
    error,
  } = useDentityProfile({
    token: dentityToken,
    enabled: isReadyToFetchProfile,
  })

  const isLoading = isDentityTokenLoading || isDentityProfileLoading
  const [dialogProps, setDialogProps] = useState<VerificationErrorDialogProps>()
  const onClose = () => setDialogProps(undefined)
  const onDismiss = () => setDialogProps(undefined)

  useEffect(() => {
    if (data && !isLoading) {
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
            createTransactionFlow,
            t,
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
