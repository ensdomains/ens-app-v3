import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, mq } from '@ensdomains/thorin'

import { usePrimaryNameOrAddress } from '@app/hooks/reverseRecord/usePrimaryNameOrAddress'
import useOwners from '@app/hooks/useOwners'
import useParentBasicName from '@app/hooks/useParentBasicName'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

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
  contract: 'registry' | 'nameWrapper'
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const DeleteSubnameNotParentWarning = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const {
    ownerData: parentOwnerData,
    wrapperData: parentWrapperData,
    isLoading: parentBasicLoading,
  } = useParentBasicName(data.name)
  const [ownerTarget] = useOwners({
    ownerData: parentOwnerData,
    wrapperData: parentWrapperData,
  })
  const { data: parentPrimaryOrAddress, isLoading: parentPrimaryLoading } = usePrimaryNameOrAddress(
    ownerTarget?.address || '',
  )
  const isLoading = parentBasicLoading || parentPrimaryLoading

  const handleDelete = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('deleteSubname', {
          name: data.name,
          contract: data.contract,
          method: 'setRecord',
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  if (isLoading) return <TransactionLoader />

  return (
    <>
      <Dialog.Heading title={t('input.deleteSubnameNotParentWarning.title')} alert="error" />
      <MessageContainer>
        <Trans
          i18nKey="input.deleteSubnameNotParentWarning.message"
          ns="transactionFlow"
          components={{ b: <strong /> }}
          values={{
            ownershipTerm: t(ownerTarget.label, { ns: 'common' }).toLocaleLowerCase(),
            parentOwner: parentPrimaryOrAddress.nameOrAddr,
          }}
        />
      </MessageContainer>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            colorStyle="redPrimary"
            onClick={handleDelete}
            data-testid="delete-subname-not-parent-button"
          >
            {t('action.understand', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default DeleteSubnameNotParentWarning
