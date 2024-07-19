import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import type { VerificationErrorDialogProps } from '@app/components/pages/VerificationErrorDialog'
import { DENTITY_ISS } from '@app/constants/verification'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import {
  useVerificationOAuth,
  UseVerificationOAuthReturnType,
} from '../useVerificationOAuth/useVerificationOAuth'
import { checkCanCompleteVerificationFlow } from './utils/checkCanCompleteVerificationFlow'
import { createVerificationTransactionFlow } from './utils/createVerificationTransactionFlow'
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
  const { createTransactionFlow } = useTransactionFlow()

  const { address: userAddress } = useAccount()

  const onSuccessCallback = useCallback(
    (resp: UseVerificationOAuthReturnType) => {
      if (!checkCanCompleteVerificationFlow(userAddress)(resp)) return

      const { name, verifier, address, token, resolverAddress } = resp
      // Do I need to check ownerhsip here?
      createVerificationTransactionFlow({
        verifier,
        name,
        address,
        userAddress,
        resolverAddress,
        token,
        router,
        createTransactionFlow,
      })
    },
    [userAddress, router, createTransactionFlow],
  )

  const isReady = !!createTransactionFlow && !!router && !!userAddress

  console.log('isReady', isReady)
  const { data, isLoading, error } = useVerificationOAuth({
    verifier: issToVerificationProtocol(iss),
    code,
    enabled: isReady,
  })
  console.log('data', data, issToVerificationProtocol(iss))
  const [dialogProps, setDialogProps] =
    useState<Omit<VerificationErrorDialogProps, 'onClose' | 'onDismiss'>>()
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
          }),
        )
        .otherwise(() => undefined)
      setDialogProps(newProps)
    }
  }, [data, isLoading, error])

  return {
    dialogProps,
  }
}
