import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Typography } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { Outlink } from '@app/components/Outlink'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

const StyledInnerDialog = styled(InnerDialog)(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const Subtitle = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

type SettingsDict = {
  [key: string]: {
    handler?: () => void
    href?: string
    as?: 'a'
    dismissable: boolean
    link?: {
      href: string
      label: string
    }
  }
}

type Props = {
  name: string
  isWrapped: boolean
  resumable?: boolean
  hasOldRegistry?: boolean
  hasMigratedProfile?: boolean
  hasNoResolver?: boolean
  latestResolver: string
  oldResolver: string
  onDismissOverlay?: () => void
} & TransactionDialogPassthrough

const ResolverWarningOverlay = ({
  name,
  isWrapped,
  hasOldRegistry = false,
  resumable = false,
  hasMigratedProfile = false,
  hasNoResolver = false,
  latestResolver,
  oldResolver,
  dispatch,
  onDismiss,
  onDismissOverlay,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  const handleResumeTransaction = () => {
    dispatch({ name: 'resumeFlow', key: `edit-profile-flow-${name}` })
  }

  const handleUpdateResolver = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('updateResolver', {
          name,
          contract: isWrapped ? 'nameWrapper' : 'registry',
          resolver: latestResolver,
          oldResolver,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  const handleTransferProfile = () => {
    dispatch({
      name: 'showDataInput',
      payload: {
        input: {
          name: 'TransferProfile',
          data: { name, isWrapped },
        },
      },
      key: `edit-profile-${name}`,
    })
  }

  /* eslint-disable no-nested-ternary */
  const settingsKey = hasOldRegistry
    ? 'oldRegistry'
    : resumable
    ? 'resumable'
    : hasMigratedProfile
    ? 'migrate'
    : hasNoResolver
    ? 'noResolver'
    : 'default'

  const settingsDict: SettingsDict = {
    resumable: {
      handler: handleResumeTransaction,
      dismissable: true,
    },
    migrate: {
      handler: handleUpdateResolver,
      dismissable: true,
      link: {
        href: 'https://support.ens.domains/docs/core/records/resolver',
        label: t('input.profileEditor.warningOverlay.links.learnMoreResolvers'),
      },
    },
    noResolver: {
      handler: handleUpdateResolver,
      dismissable: false,
      link: {
        href: 'https://support.ens.domains/docs/core/records/resolver',
        label: t('input.profileEditor.warningOverlay.links.learnMoreResolvers'),
      },
    },
    oldRegistry: {
      dismissable: false,
      as: 'a',
      href: `https://app.ens.domains/name/${name}`,
    },
    default: {
      handler: handleTransferProfile,
      dismissable: true,
      link: {
        href: 'https://support.ens.domains/docs/core/records/resolver',
        label: t('input.profileEditor.warningOverlay.links.learnMoreResolvers'),
      },
    },
  }
  const { dismissable, handler, as, href, link } = settingsDict[settingsKey]
  const title = t(`input.profileEditor.warningOverlay.${settingsKey}.title`)
  const subtitle = t(`input.profileEditor.warningOverlay.${settingsKey}.subtitle`)
  const action = t(`input.profileEditor.warningOverlay.${settingsKey}.action`)

  const handleUpgrade = () => {
    handler?.()
  }

  const secondaryActionLabel = dismissable
    ? t('tabs.profile.actions.editProfile.label', { ns: 'profile' })
    : t('action.cancel', { ns: 'common' })

  const handleSecondaryAction = useCallback(() => {
    if (dismissable) return onDismissOverlay?.()
    onDismiss?.()
  }, [dismissable, onDismiss, onDismissOverlay])

  return (
    <>
      <Dialog.Heading title={title} alert="warning" />
      <StyledInnerDialog data-testid="warning-overlay">
        <Subtitle color="grey">{subtitle}</Subtitle>
        {link && <Outlink href={link.href}>{link.label}</Outlink>}
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={handleSecondaryAction}
            data-testid="warning-overlay-secondary-action"
          >
            {secondaryActionLabel}
          </Button>
        }
        trailing={
          <Button
            as={as}
            href={href}
            target="_blank"
            onClick={handleUpgrade}
            data-testid="profile-editor-overlay-button"
          >
            {action}
          </Button>
        }
      />
    </>
  )
}

export default ResolverWarningOverlay
