import { QueryClientProvider } from '@tanstack/react-query'
import { type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@ensdomains/thorin'

import { queryClientWithRefetch } from '@app/utils/query/reactQuery'

import { useTransactionStore } from '../transactionStore'
import type { GenericDataInput, StoredFlow, StoredTransaction, TransactionIntro } from '../types'
import { DataInputComponents, type DataInputName } from '../user/input'
import { userTransactions } from '../user/transaction'
import { IntroStageModal } from './stage/intro/IntroStageModal'
import { TransactionStageModal } from './stage/transaction/TransactionStageModal'

export type TransactionDialogPassthrough = {
  onDismiss: () => void
  transactions?: StoredTransaction[]
}

const InputContent = <name extends DataInputName = DataInputName>({
  flow,
}: {
  flow: StoredFlow & { input: GenericDataInput<name> }
}) => {
  const transactions = useTransactionStore((s) => s.flow.current.getTransactions())
  const onDismiss = useTransactionStore((s) => s.flow.current.stop)
  const Component = DataInputComponents[flow.input.name] as ComponentType<
    { data: any } & TransactionDialogPassthrough
  >
  return (
    <QueryClientProvider client={queryClientWithRefetch}>
      <Component data={flow.input.data} onDismiss={onDismiss} transactions={transactions} />
    </QueryClientProvider>
  )
}

const IntroContent = ({ flow }: { flow: StoredFlow & { intro: TransactionIntro } }) => {
  const transactions = useTransactionStore((s) => s.flow.current.getTransactions())
  const setFlowStage = useTransactionStore((s) => s.flow.current.setStage)
  const onDismiss = useTransactionStore((s) => s.flow.current.stop)

  const currentTransaction = transactions[flow.currentTransaction]
  const currentStep =
    currentTransaction.status === 'success' ? flow.currentTransaction + 1 : flow.currentTransaction
  const stepStatus =
    currentTransaction.status === 'pending' || currentTransaction.status === 'reverted'
      ? 'inProgress'
      : 'notStarted'

  return (
    <IntroStageModal
      stepStatus={stepStatus}
      currentStep={currentStep}
      onSuccess={() => setFlowStage({ stage: 'transaction' })}
      {...{
        ...flow.intro,
        onDismiss,
        transactions,
      }}
    />
  )
}

const TransactionContent = ({ flow }: { flow: StoredFlow }) => {
  const { t } = useTranslation()
  const transactions = useTransactionStore((s) => s.flow.current.getTransactions())
  const onDismiss = useTransactionStore((s) => s.flow.current.stop)
  const currentTransaction = transactions[flow.currentTransaction]
  const userTransaction = userTransactions[currentTransaction.name]

  const displayItems = userTransaction.displayItems(currentTransaction.data as never, t)

  return (
    <TransactionStageModal
      backToInput={'backToInput' in userTransaction ? !!userTransaction.backToInput : false}
      currentTransactionIndex={flow.currentTransaction}
      displayItems={displayItems}
      onDismiss={onDismiss}
      transaction={currentTransaction}
      transactionCount={transactions.length}
    />
  )
}

const Content = ({ flow }: { flow: StoredFlow | null }) => {
  if (!flow) return null

  if (flow.input && flow.currentStage === 'input')
    return <InputContent flow={flow as StoredFlow & { input: GenericDataInput<DataInputName> }} />
  if (flow.intro && flow.currentStage === 'intro')
    return <IntroContent flow={flow as StoredFlow & { intro: TransactionIntro }} />
  return <TransactionContent flow={flow} />
}

export const TransactionDialogManager = () => {
  const { flow, isPrevious } = useTransactionStore((s) => s.flow.current.selectedOrPrevious())
  const stopFlow = useTransactionStore((s) => s.flow.current.stop)
  const attemptDismiss = useTransactionStore((s) => s.flow.current.attemptDismiss)

  return (
    <Dialog
      variant="blank"
      open={!!flow && !isPrevious}
      onDismiss={attemptDismiss}
      onClose={stopFlow}
    >
      <Content flow={flow} />
    </Dialog>
  )
}
