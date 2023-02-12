import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, mq } from '@ensdomains/thorin'

import { useGetWrapperData } from '@app/hooks/useGetWrapperData'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { makeTransactionItem } from '../../transaction/index'

const MessageContainer = styled.div(() => [
  css``,
  mq.sm.min(css`
    width: 100vw;
    max-width: 510px;
  `),
])

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const DeleteEmancipatedSubnameWarning = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { wrapperData, isLoading } = useGetWrapperData(data.name)
  const expiryStr = wrapperData?.expiryDate
    ? new Date(wrapperData.expiryDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : undefined
  const expiryLabel = expiryStr ? ` (${expiryStr})` : ''

  const handleDelete = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('deleteSubname', {
          name: data.name,
          contract: 'nameWrapper',
          method: 'setRecord',
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  return (
    <>
      <Dialog.Heading title={t('input.deleteEmancipatedSubnameWarning.title')} alert="error" />
      <MessageContainer>
        {t('input.deleteEmancipatedSubnameWarning.message', { date: expiryLabel })}
      </MessageContainer>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            disabled={isLoading}
            onClick={handleDelete}
            data-testid="delete-emancipated-subname-button"
          >
            {t('action.understand', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default DeleteEmancipatedSubnameWarning
