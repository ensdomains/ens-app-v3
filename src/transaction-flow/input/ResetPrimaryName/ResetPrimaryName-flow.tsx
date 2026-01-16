import { useTranslation } from 'react-i18next'
import type { Address } from 'viem'

import { Button, Dialog } from '@ensdomains/thorin'

import { usePrimaryNameFromSources } from '@app/hooks/primary/usePrimaryNameFromSources'

import { makeIntroItem } from '../../intro'
import { createTransactionItem } from '../../transaction'
import { TransactionDialogPassthrough } from '../../types'
import { CenteredTypography } from '../ProfileEditor/components/CenteredTypography'

type Data = {
  address: Address
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ResetPrimaryName = ({ data: { address }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { data: primaryNameData, isLoading } = usePrimaryNameFromSources({ address })

  const handleSubmit = async () => {
    const transactions = [
      ...(primaryNameData?.hasPrimaryName
        ? [createTransactionItem('resetPrimaryName', { address })]
        : []),
      ...(primaryNameData?.hasDefaultPrimaryName
        ? [createTransactionItem('resetDefaultPrimaryName', { address })]
        : []),
    ]

    dispatch({
      name: 'startFlow',
      key: `reset-primary-name-${address}`,
      payload: {
        ...(transactions.length > 1 && {
          intro: {
            title: ['input.resetPrimaryName.title', { ns: 'transactionFlow' }],
            content: makeIntroItem('GenericWithDescription', {
              description: t('input.resetPrimaryName.description'),
            }),
          },
        }),
        transactions,
      },
    })
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
          <Button data-testid="primary-next" onClick={handleSubmit} disabled={isLoading}>
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default ResetPrimaryName
