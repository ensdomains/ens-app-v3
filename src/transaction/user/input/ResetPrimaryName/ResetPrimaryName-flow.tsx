import { useTranslation } from 'react-i18next'
import type { Address } from 'viem'

import { Button, Dialog } from '@ensdomains/thorin'

import type { TransactionDialogPassthrough } from '@app/transaction/components/TransactionDialogManager'

import { CenteredTypography } from '../ProfileEditor/components/CenteredTypography'

type Data = {
  address: Address
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ResetPrimaryName = ({ data: { address }, setTransactions, setStage, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const handleSubmit = async () => {
    setTransactions([
      {
        name: 'resetPrimaryName',
        data: { address },
      },
    ])
    setStage('transaction')
  }

  return (
    <>
      <Dialog.Heading alert="warning" title={t('input.resetPrimaryName.title')} />
      <Dialog.Content>
        <CenteredTypography>{t('input.resetPrimaryName.description')}</CenteredTypography>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button data-testid="primary-next" onClick={handleSubmit}>
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default ResetPrimaryName
