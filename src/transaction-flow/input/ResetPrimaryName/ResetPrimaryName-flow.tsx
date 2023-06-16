import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'

import { makeTransactionItem } from '../../transaction'
import { TransactionDialogPassthrough } from '../../types'

type Data = {
  address: string
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const StyledInnerDialog = styled(InnerDialog)(
  () => css`
    text-align: center;
  `,
)

const ResetPrimaryName = ({ data: { address }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const handleSubmit = async () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('resetPrimaryName', {
          address,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  return (
    <>
      <Dialog.Heading alert="warning" title={t('input.resetPrimaryName.title')} />
      <StyledInnerDialog>{t('input.resetPrimaryName.description')}</StyledInnerDialog>
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
