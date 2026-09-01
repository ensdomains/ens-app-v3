import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Address } from 'viem'

import { Button, Dialog } from '@ensdomains/thorin'

import EditResolverForm from '@app/components/@molecules/EditResolver/EditResolverForm'
import { useEffectiveResolverAddress } from '@app/hooks/resolver/useEffectiveResolverAddress'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'
import useResolverEditor from '@app/hooks/useResolverEditor'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { createTransactionItem } from '../../transaction'
import TransactionLoader from '../../TransactionLoader'

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

export const EditResolver = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { name } = data
  const { data: isWrapped } = useIsWrapped({ name })
  const formRef = useRef<HTMLFormElement>(null)

  const { data: profile = { resolverAddress: '' }, isLoading: profileLoading } = useProfile({
    name: name as string,
  })

  // Edit against the resolver that actually holds the name's records, which is
  // what the More tab displays. Comparing the reported address instead makes an
  // abstracted name whose underlying resolver is already the latest look
  // out-of-date, so the form preselects "switch to latest" and one confirm
  // replaces the abstraction; and it lets the address the tab just showed be
  // typed in as a "new" resolver rather than rejected as the current one.
  const effectiveResolver = useEffectiveResolverAddress({
    name,
    // The destructure above defaults a missing resolver to '', which is not an
    // address; the hook wants "no resolver" spelled as undefined.
    resolverAddress: profile.resolverAddress || undefined,
  })
  const resolverAddress = effectiveResolver.data ?? profile.resolverAddress

  const handleCreateTransaction = useCallback(
    (newResolver: Address) => {
      dispatch({
        name: 'setTransactions',
        payload: [
          createTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress: newResolver,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
    },
    [dispatch, name, isWrapped],
  )

  const editResolverForm = useResolverEditor({
    resolverAddress,
    // On a failed lookup the address above is the reported one, which for an
    // abstracted name is the mirror — the comparison that would otherwise
    // preselect "switch to latest" is not trustworthy.
    isResolverAddressUnknown: effectiveResolver.isError,
    callback: handleCreateTransaction,
  })
  const { hasErrors } = editResolverForm

  const handleSubmitForm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  // Hold the form until the lookup settles. While it is in flight the address
  // above is the reported one, so an abstracted name already on the latest
  // resolver looks out of date, "Latest" stays preselected and enabled, and a
  // click in that window replaces the abstraction. Waiting also means the
  // form's own correction runs before the user can touch anything, so it can
  // never be skipped by a field they have already edited.
  if (profileLoading || effectiveResolver.isLoading) return <TransactionLoader />

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
