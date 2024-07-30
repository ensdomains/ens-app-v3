import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { CenteredTypography } from '@app/transaction-flow/input/ProfileEditor/components/CenteredTypography'

type Props = { onClear: () => void } & Omit<ComponentProps<typeof Dialog>, 'children' | 'variant'>

export const ClearTransactionsDialog = ({ open, onDismiss, onClose, onClear }: Props) => {
  const { t } = useTranslation('settings')
  return (
    <Dialog open={open} variant="blank" onDismiss={onDismiss} onClose={onClose}>
      <Dialog.Heading alert="warning" title={t('section.transaction.clearTransactions.title')} />
      <Dialog.Content>
        <CenteredTypography>
          {t('section.transaction.clearTransactions.description')}
        </CenteredTypography>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={onClear} data-testid="clear-transactions-dialog-clear-button">
            {t('section.transaction.clearTransactions.actionLabel')}
          </Button>
        }
      />
    </Dialog>
  )
}
