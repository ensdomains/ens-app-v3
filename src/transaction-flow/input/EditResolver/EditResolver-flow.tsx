import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, mq } from '@ensdomains/thorin'

import EditResolverForm from '@app/components/@molecules/EditResolver/EditResolverForm'
import EditResolverWarnings from '@app/components/@molecules/EditResolver/EditResolverWarnings'
import { useBasicName } from '@app/hooks/useBasicName'
import { useProfile } from '@app/hooks/useProfile'
import useResolverEditor from '@app/hooks/useResolverEditor'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { makeTransactionItem } from '../../transaction'

const EditResolverFormContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

export const EditResolver = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { name } = data
  const { isWrapped } = useBasicName(name)
  const formRef = useRef<HTMLFormElement>(null)

  const { profile = { resolverAddress: '' } } = useProfile(name as string)
  const { resolverAddress } = profile

  const handleCreateTransaction = useCallback(
    (newResolver: string) => {
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolver: newResolver,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
    },
    [dispatch, name, isWrapped],
  )

  const editResolverForm = useResolverEditor({ resolverAddress, callback: handleCreateTransaction })
  const { hasErrors } = editResolverForm

  const handleSubmitForm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <>
      <EditResolverFormContainer>
        <EditResolverWarnings {...editResolverForm} />
        <EditResolverForm {...{ ...editResolverForm, resolverAddress, formRef }} />
      </EditResolverFormContainer>
      <Dialog.Footer
        leading={
          <Button colorScheme="secondary" color="grey" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={handleSubmitForm} disabled={hasErrors} data-testid="update-button">
            {t('action.update', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default EditResolver
