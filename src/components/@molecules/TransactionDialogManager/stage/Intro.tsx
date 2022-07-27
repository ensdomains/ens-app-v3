import { intros } from '@app/transaction-flow/intro'
import { TransactionIntro } from '@app/transaction-flow/types'
import { Button, Dialog, mq } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { DisplayItems } from '../DisplayItems'

const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    padding: 0 ${theme.space['5']};
    gap: ${theme.space['4']};
    max-height: 60vh;
    overflow-y: auto;
    ${mq.sm.min(css`
      min-width: ${theme.space['128']};
    `)}
  `,
)

const ButtonShrinkwrap = styled(Button)(
  () => css`
    width: 80%;
    flex-shrink: 1;
    ${mq.md.min(css`
      width: 100%;
    `)}
  `,
)

export const IntroStageModal = ({
  transactions,
  onDismiss,
  onSuccess,
  currentStep,
  content,
  title,
  leadingLabel,
  trailingLabel,
}: TransactionIntro & {
  transactions: {
    name: string
  }[]
  currentStep: number
  onDismiss: () => void
  onSuccess: () => void
}) => {
  const { t } = useTranslation()

  const LeadingButton = (
    <ButtonShrinkwrap
      onClick={() => {
        onDismiss?.()
      }}
      variant="secondary"
      tone="grey"
      shadowless
      data-testid="transaction-modal-dismiss-btn"
    >
      {leadingLabel || t('action.cancel')}
    </ButtonShrinkwrap>
  )

  const tLabel =
    currentStep > 0
      ? t('transaction.dialog.intro.trailingButtonResume')
      : t('transaction.dialog.intro.trailingButton')

  const TrailingButton = (
    <Button
      shadowless
      variant="primary"
      onClick={() => onSuccess()}
      data-testid="transaction-dialog-intro-trailing-btn"
    >
      {trailingLabel || tLabel}
    </Button>
  )

  const txCount = transactions.length

  const Content = intros[content.name]

  return (
    <>
      <Dialog.Heading
        currentStep={currentStep}
        stepCount={txCount}
        stepStatus="notStarted"
        title={title}
      />
      <InnerDialog data-testid="transaction-modal-inner">
        <Content {...content.data} />
        <DisplayItems
          displayItems={
            transactions.map(({ name }, index) => ({
              fade: currentStep > index,
              shrink: true,
              label: t('transaction.dialog.intro.step', { step: index + 1 }),
              value: t(`transaction.description.${name}`),
              useRawLabel: true,
            })) || []
          }
        />
      </InnerDialog>
      <Dialog.Footer leading={LeadingButton} trailing={TrailingButton} />
    </>
  )
}
