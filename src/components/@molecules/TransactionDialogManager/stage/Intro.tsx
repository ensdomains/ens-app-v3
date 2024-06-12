import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { intros } from '@app/transaction-flow/intro'
import { TransactionIntro } from '@app/transaction-flow/types'
import { TransactionDisplayItemSingle } from '@app/types'

import { DisplayItems } from '../DisplayItems'

export const IntroStageModal = ({
  transactions,
  onSuccess,
  currentStep,
  onDismiss,
  content,
  title,
  trailingLabel,
  stepStatus,
}: TransactionIntro & {
  transactions:
    | {
        name: string
      }[]
    | readonly { name: string }[]
  stepStatus: 'inProgress' | 'notStarted' | 'completed'
  currentStep: number
  onDismiss: () => void
  onSuccess: () => void
}) => {
  const { t } = useTranslation()

  const tLabel =
    currentStep > 0
      ? t('transaction.dialog.intro.trailingButtonResume')
      : t('transaction.dialog.intro.trailingButton')

  const LeadingButton = (
    <Button
      colorStyle="accentSecondary"
      onClick={() => onDismiss()}
      data-testid="transaction-dialog-intro-leading-btn"
    >
      {t('action.cancel')}
    </Button>
  )

  const TrailingButton = (
    <Button onClick={() => onSuccess()} data-testid="transaction-dialog-intro-trailing-btn">
      {trailingLabel ? t(...trailingLabel) : tLabel}
    </Button>
  )

  const txCount = transactions.length

  const Content = intros[content.name]

  return (
    <>
      <Dialog.Heading title={t(...title)} />
      <Dialog.Content data-testid="transaction-modal-inner">
        <Content {...content.data} />
        {txCount > 1 && (
          <DisplayItems
            displayItems={
              transactions.map(
                ({ name }, index) =>
                  ({
                    fade: currentStep > index,
                    shrink: true,
                    label: t('transaction.dialog.intro.step', { step: index + 1 }),
                    value: t(`transaction.description.${name}`),
                    useRawLabel: true,
                  }) as TransactionDisplayItemSingle,
              ) || []
            }
          />
        )}
      </Dialog.Content>
      <Dialog.Footer
        currentStep={currentStep}
        stepCount={txCount > 1 ? txCount : undefined}
        stepStatus={stepStatus}
        trailing={TrailingButton}
        leading={LeadingButton}
      />
    </>
  )
}
