import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, mq } from '@ensdomains/thorin'

import { useGetWrapperData } from '@app/hooks/useGetWrapperData'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { makeTransactionItem } from '../../transaction/index'
import { CenterAlignedTypography } from '../RevokePermissions/components/CenterAlignedTypography'

const MessageContainer = styled(CenterAlignedTypography)(({ theme }) => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: calc(80vw - 2 * ${theme.space['6']});
    max-width: ${theme.space['128']};
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
      <Dialog.Heading title={t('input.deleteEmancipatedSubnameWarning.title')} alert="warning" />
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
