import { TFunction } from 'i18next'
import { match, P } from 'ts-pattern'
import { Hash } from 'viem'

import {
  ButtonProps,
  VerificationErrorDialogProps,
} from '@app/components/pages/VerificationErrorDialog'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { getDestination } from '@app/routes'
import { CreateTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { shortenAddress } from '../../../../utils/utils'
import { UseDentityProfileReturnType } from '../../useDentityProfile/useDentityProfile'
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
    t,
  }: {
    userAddress?: Hash
    onClose: () => void
    onDismiss: () => void
    router: ReturnType<typeof useRouterWithHistory>
    createTransactionFlow: CreateTransactionFlow
    t: TFunction
  }) =>
  (json: UseDentityProfileReturnType): VerificationErrorDialogProps => {
    return match(json)
      .with(
        {
          name: P.string,
          owner: P.string,
          verifiedPresentationUri: P.string,
          resolverAddress: P.string,
        },
        ({ owner, manager }) => {
          if (owner && manager) return manager.toLowerCase() === userAddress?.toLowerCase()
          return owner.toLowerCase() === userAddress?.toLowerCase()
        },
        ({ verifier, name, resolverAddress, verifiedPresentationUri, verificationRecord }) => {
          router.push(`/${name}`)

          const vcUris = verificationRecord ? tryJsonParse(verificationRecord) : []

          // If the user has already verified the presentation, do not create a new transaction
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
            title: t('verificationErrorDialog.title'),
            message: t('verificationErrorDialog.resolverRequired'),
            actions: {
              leading: {
                children: t('action.close'),
                colorStyle: 'accentSecondary',
                onClick: () => onClose(),
              } as ButtonProps,
              trailing: {
                children: t('action.goToProfile'),
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
            title: t('verificationErrorDialog.title'),
            message: t('verificationErrorDialog.ownerNotManager'),
            actions: {
              trailing: {
                children: t('action.done'),
                onClick: () => onClose(),
              } as ButtonProps,
            },
            onClose,
            onDismiss,
          }) as VerificationErrorDialogProps,
      )
      .with(
        {
          owner: P.string,
          name: P.string,
          verifiedPresentationUri: P.string,
          resolverAddress: P.string,
        },
        ({ manager, owner, primaryName }) =>
          ({
            open: true,
            title: t('verificationErrorDialog.title'),
            message: {
              t,
              i18nKey: 'verificationErrorDialog.wrongAccount',
              values: { nameOrAddress: primaryName ?? shortenAddress(manager ?? owner) },
            },
            actions: {
              trailing: {
                children: t('action.done'),
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
            title: t('verificationErrorDialog.title'),
            message: t('verificationErrorDialog.default'),
            actions: {
              trailing: {
                children: t('action.close'),
                colorStyle: 'accentSecondary',
                onClick: () => onClose(),
              } as ButtonProps,
            },
            onClose,
            onDismiss,
          }) as VerificationErrorDialogProps,
      )
  }
