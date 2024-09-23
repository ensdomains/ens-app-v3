import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Address } from 'viem'

import { Button, Dialog } from '@ensdomains/thorin'

import EditResolverForm from '@app/components/@molecules/EditResolver/EditResolverForm'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'
import useResolverEditor from '@app/hooks/useResolverEditor'
import type { TransactionDialogPassthrough } from '@app/transaction/components/TransactionDialogManager'

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

export const EditResolver = ({ data, onDismiss, setTransactions, setStage }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { name } = data
  const { data: isWrapped } = useIsWrapped({ name })
  const formRef = useRef<HTMLFormElement>(null)

  const { data: profile = { resolverAddress: '' } } = useProfile({ name: name as string })
  const { resolverAddress } = profile

  const handleCreateTransaction = useCallback(
    (newResolver: Address) => {
      setTransactions([
        {
          name: 'updateResolver',
          data: {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress: newResolver,
          },
        },
      ])
      setStage('transaction')
    },
    [setTransactions, setStage, name, isWrapped],
  )

  const editResolverForm = useResolverEditor({ resolverAddress, callback: handleCreateTransaction })
  const { hasErrors } = editResolverForm

  const handleSubmitForm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <>
      <Dialog.Heading title={t('input.editResolver.title')} />
      <EditResolverForm {...{ ...editResolverForm, resolverAddress, formRef }} />
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
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
