import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

import { saveName } from '@ensdomains/ensjs/utils'

import { useQueryOptions } from '@app/hooks/useQueryOptions'

import { TransactionDialogPassthrough, TransactionFlowItem } from '../../types'
import { FormData, nameToFormData, UnknownLabelsForm } from './views/UnknownLabelsForm'

type Data = {
  name: string
  key: string
  transactionFlowItem: TransactionFlowItem
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const UnknownLabels = ({
  data: { name, key, transactionFlowItem },
  dispatch,
  onDismiss,
}: Props) => {
  const queryClient = useQueryClient()

  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: nameToFormData(name),
  })

  const onConfirm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const { queryKey: validateKey } = useQueryOptions({
    params: { input: name },
    functionName: 'validate',
    queryDependencyType: 'independent',
    keyOnly: true,
  })
  const onSubmit = (data: FormData) => {
    const newName = [
      ...data.unknownLabels.labels.map((label) => label.value),
      data.unknownLabels.tld,
    ].join('.')

    saveName(newName)

    const { transactions, intro } = transactionFlowItem

    const newKey = key.replace(name, newName)

    const newTransactions = transactions.map((tx) =>
      typeof tx.data === 'object' && 'name' in tx.data && tx.data.name
        ? { ...tx, data: { ...tx.data, name: newName } }
        : tx,
    )

    const newIntro =
      intro && typeof intro.content.data === 'object' && intro.content.data.name
        ? {
            ...intro,
            content: { ...intro.content, data: { ...intro.content.data, name: newName } },
          }
        : intro

    queryClient.resetQueries({ queryKey: validateKey, exact: true })

    dispatch({
      name: 'startFlow',
      key: newKey,
      payload: {
        ...transactionFlowItem,
        transactions: newTransactions,
        intro: newIntro as any,
      },
    })
  }

  return (
    <UnknownLabelsForm
      {...form}
      onCancel={onDismiss}
      onConfirm={onConfirm}
      ref={formRef}
      onSubmit={onSubmit}
    />
  )
}

export default UnknownLabels
