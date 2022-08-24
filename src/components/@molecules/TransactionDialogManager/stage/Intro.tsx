import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { intros } from '@app/transaction-flow/intro'
import { TransactionIntro } from '@app/transaction-flow/types'
import { TransactionDisplayItemSingle } from '@app/types'
import { Button, Dialog } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import { DisplayItems } from '../DisplayItems'

export const IntroStageModal = ({
  transactions,
  onSuccess,
  currentStep,
  content,
  title,
  trailingLabel,
  stepStatus,
}: TransactionIntro & {
  transactions: {
    name: string
  }[]
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
        stepStatus={stepStatus}
        title={title}
      />
      <InnerDialog data-testid="transaction-modal-inner">
        <Content {...content.data} />
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
                } as TransactionDisplayItemSingle),
            ) || []
          }
        />
      </InnerDialog>
      <Dialog.Footer center trailing={TrailingButton} />
    </>
  )
}
