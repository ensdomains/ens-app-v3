import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import DismissDialogButton from '@app/components/@atoms/DismissDialogButton/DismissDialogButton'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

const Container = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      41.95% 17.64% at 50.14% 50.08%,
      #fff 0%,
      rgba(255, 255, 255, 0.81) 100%
    );
    backdrop-filter: blur(8px);
    border-radius: ${theme.radii.extraLarge};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    width: 90%;
    max-width: ${theme.space['72']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['9']};
  `,
)

const Message = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
)

const Title = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const Subtitle = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const DismissButtonWrapper = styled.div(
  () => css`
    position: absolute;
    top: 0;
    right: 0;
  `,
)
type SettingsDict = {
  [key: string]: {
    handler?: () => void
    href?: string
    as?: 'a'
    dismissable: boolean
  }
}

type Props = {
  name: string
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
          contract: 'registry',
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
          data: { name },
        },
        disableBackgroundClick: true,
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
    },
    noResolver: {
      handler: handleUpdateResolver,
      dismissable: false,
    },
    oldRegistry: {
      dismissable: false,
      as: 'a',
      href: `https://app.ens.domains/name/${name}`,
    },
    default: {
      handler: handleTransferProfile,
      dismissable: true,
    },
  }
  const { dismissable, handler, as, href } = settingsDict[settingsKey]
  const title = t(`input.profileEditor.warningOverlay.${settingsKey}.title`)
  const subtitle = t(`input.profileEditor.warningOverlay.${settingsKey}.subtitle`)
  const action = t(`input.profileEditor.warningOverlay.${settingsKey}.action`)

  const handleUpgrade = () => {
    handler?.()
  }

  const handleDismiss = useCallback(() => {
    if (dismissable) return onDismissOverlay?.()
    onDismiss?.()
  }, [dismissable, onDismiss, onDismissOverlay])

  return (
    <Container data-testid="warning-overlay">
      <DismissButtonWrapper data-testid="warning-overlay-dismiss">
        <DismissDialogButton onClick={handleDismiss} />
      </DismissButtonWrapper>
      <Content>
        <Message>
          <Title typography="Heading/H4">{title}</Title>
          <Subtitle color="grey">{subtitle}</Subtitle>
        </Message>
        <Button as={as} href={href} target="_blank" onClick={handleUpgrade}>
          {action}
        </Button>
      </Content>
    </Container>
  )
}

export default ResolverWarningOverlay
