import { match, P } from 'ts-pattern'
import { Hash } from 'viem'

import {
  ButtonProps,
  VerificationErrorDialogProps,
} from '@app/components/pages/VerificationErrorDialog'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { getDestination } from '@app/routes'
import { CreateTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { UseVerificationOAuthReturnType } from '../../useVerificationOAuth/useVerificationOAuth'
import { createVerificationTransactionFlow } from './createVerificationTransactionFlow'

// Patterns

export const makeIsOwnerNotManagerPattern = (userAddress?: Hash) => {
  return {
    owner: P.when<Hash | undefined, (input?: string) => boolean>((owner) => owner === userAddress),
    manager: P.when<Hash | undefined, (input?: string) => boolean>(
      (manager) => manager !== userAddress,
    ),
  } as const
}

const tryJsonParse = (json: string) => {
  try {
    return JSON.parse(json)
  } catch {
    return undefined
  }
}

export const dentityVerificationHandler =
  ({
    userAddress,
    onClose,
    onDismiss,
    router,
    createTransactionFlow,
  }: {
    userAddress?: Hash
    onClose: () => void
    onDismiss: () => void
    router: ReturnType<typeof useRouterWithHistory>
    createTransactionFlow: CreateTransactionFlow
  }) =>
  (json: UseVerificationOAuthReturnType): VerificationErrorDialogProps => {
    return match(json)
      .with(
        {
          name: P.string,
          owner: P.string,
          verifiedPresentationUri: P.string,
          resolverAddress: P.string,
        },
        ({ owner, manager }) => {
          if (owner && manager) return manager === userAddress
          return owner === userAddress
        },
        ({ verifier, name, resolverAddress, verifiedPresentationUri, verificationRecord }) => {
          router.push(`/${name}`)

          const vcUris = verificationRecord ? tryJsonParse(verificationRecord) : []

          if (Array.isArray(vcUris) && vcUris.includes(verifiedPresentationUri)) return undefined

          createVerificationTransactionFlow({
            name,
            resolverAddress,
            verifier,
            verifiedPresentationUri,
            createTransactionFlow,
          })
          return undefined
        },
      )
      .with(
        { resolverAddress: P.nullish },
        () =>
          ({
            open: true,
            onDismiss,
            onClose,
            title: 'Verification failed',
            message: 'Resolver address is required to complete verification flow',
            actions: {
              leading: {
                children: 'Close',
                colorStyle: 'accentSecondary',
                onClick: () => onClose(),
              } as ButtonProps,
              trailing: {
                children: 'Go to profile',
                as: 'a',
                href: getDestination(`/${json.name}`),
              } as ButtonProps,
            },
          }) as VerificationErrorDialogProps,
      )
      .with(
        makeIsOwnerNotManagerPattern(userAddress),
        () =>
          ({
            open: true,
            title: 'Verification failed',
            message:
              'You must be connected as the Manager of this name to set the verification record. You can view and update the Manager under the Ownership tab.',
            actions: {
              trailing: {
                children: 'Done',
                onClick: () => onClose(),
              } as ButtonProps,
            },
            onClose,
            onDismiss,
          }) as VerificationErrorDialogProps,
      )
      .otherwise(
        () =>
          ({
            open: true,
            title: 'Verification failed',
            message: "We could't verify your account. Please return to Dentity and try again.",
            actions: {
              trailing: {
                children: 'Close',
                colorStyle: 'accentSecondary',
                onClick: () => onClose(),
              } as ButtonProps,
            },
            onClose,
            onDismiss,
          }) as VerificationErrorDialogProps,
      )
  }
