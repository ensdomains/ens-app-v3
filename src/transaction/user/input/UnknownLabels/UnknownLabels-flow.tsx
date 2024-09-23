import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

import { saveName } from '@ensdomains/ensjs/utils'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import type { TransactionDialogPassthrough } from '@app/transaction/components/TransactionDialogManager'
import type { FlowInitialiserData } from '@app/transaction/slices/createFlowSlice'
import { useTransactionManager } from '@app/transaction/transactionManager'

import type { TransactionIntro } from '../../intro'
import type { UserTransaction } from '../../transaction'
import { FormData, nameToFormData, UnknownLabelsForm } from './views/UnknownLabelsForm'

type Data = {
  name: string
  flow: Pick<FlowInitialiserData, 'resumable' | 'flowId' | 'intro' | 'transactions'>
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const UnknownLabels = ({ data: { name, flow }, onDismiss }: Props) => {
  const queryClient = useQueryClient()
  const getTransactions = useTransactionManager((s) => s.getFlowTransactions)
  const startFlow = useTransactionManager((s) => s.startFlow)

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

    const { flowId, intro } = flow
    const transactions = getTransactions(flow.flowId)

    const newFlowId = flowId.replace(name, newName)

    const newTransactions = transactions.map((tx) =>
      typeof tx.data === 'object' && 'name' in tx.data && tx.data.name
        ? { ...tx, data: { ...tx.data, name: newName } }
        : tx,
    ) as UserTransaction[]

    const newIntro = (
      intro &&
      typeof intro.content.data === 'object' &&
      intro.content.data &&
      'name' in intro.content.data &&
      intro.content.data?.name
        ? {
            ...intro,
            content: { ...intro.content, data: { ...intro.content.data, name: newName } },
          }
        : intro
    ) as TransactionIntro

    queryClient.resetQueries({ queryKey: validateKey, exact: true })

    startFlow({
      ...flow,
      flowId: newFlowId,
      transactions: newTransactions,
      intro: newIntro,
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
