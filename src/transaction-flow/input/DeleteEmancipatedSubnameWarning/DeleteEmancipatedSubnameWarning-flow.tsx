import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin'

import { useWrapperData } from '@app/hooks/ensjs/public/useWrapperData'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { createTransactionItem } from '../../transaction/index'
import { CenterAlignedTypography } from '../RevokePermissions/components/CenterAlignedTypography'

const MessageContainer = styled(CenterAlignedTypography)(
  ({ theme }) => css`
    width: 100%;
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
    }
  `,
)

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const DeleteEmancipatedSubnameWarning = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { data: wrapperData, isLoading } = useWrapperData({ name: data.name })
  const expiryStr = wrapperData?.expiry?.date
    ? wrapperData.expiry.date.toLocaleDateString(undefined, {
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
        createTransactionItem('deleteSubname', {
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
      <Dialog.Content>
        <MessageContainer>
          {t('input.deleteEmancipatedSubnameWarning.message', { date: expiryLabel })}
        </MessageContainer>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            colorStyle="redPrimary"
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
