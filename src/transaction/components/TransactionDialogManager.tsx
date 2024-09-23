import { QueryClientProvider } from '@tanstack/react-query'
import { type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@ensdomains/thorin'

import { queryClientWithRefetch } from '@app/utils/query/reactQuery'

import type { StoredFlow } from '../slices/createFlowSlice'
import type { StoredTransaction } from '../slices/createTransactionSlice'
import type { AllSlices } from '../slices/types'
import { useTransactionManager } from '../transactionManager'
import {
  transactionInputComponents,
  type GenericTransactionInput,
  type TransactionInputName,
} from '../user/input'
import type { TransactionIntro } from '../user/intro'
import { userTransactions } from '../user/transaction'
import { IntroStageModal } from './stage/intro/IntroStageModal'
import { TransactionStageModal } from './stage/transaction/TransactionStageModal'

export type TransactionDialogPassthrough = {
  onDismiss: () => void
  setTransactions: AllSlices['setCurrentFlowTransactions']
  setStage: AllSlices['setCurrentFlowStage']
  transactions?: StoredTransaction[]
}

const InputContent = <name extends TransactionInputName = TransactionInputName>({
  flow,
}: {
  flow: StoredFlow & { input: GenericTransactionInput<name> }
}) => {
  const transactions = useTransactionManager((s) => s.getFlowTransactions(flow.flowId))
  const onDismiss = useTransactionManager((s) => s.stopCurrentFlow)
  const setTransactions = useTransactionManager((s) => s.setCurrentFlowTransactions)
  const setStage = useTransactionManager((s) => s.setCurrentFlowStage)
  const Component = transactionInputComponents[flow.input.name] as ComponentType<
    { data: any } & TransactionDialogPassthrough
  >
  return (
    <QueryClientProvider client={queryClientWithRefetch}>
      <Component
        data={flow.input.data}
        onDismiss={onDismiss}
        setTransactions={setTransactions}
        setStage={setStage}
        transactions={transactions}
      />
    </QueryClientProvider>
  )
}

const IntroContent = ({ flow }: { flow: StoredFlow & { intro: TransactionIntro } }) => {
  const transactions = useTransactionManager((s) => s.getFlowTransactions(flow.flowId))
  const setFlowStage = useTransactionManager((s) => s.setCurrentFlowStage)
  const onDismiss = useTransactionManager((s) => s.stopCurrentFlow)

  const currentTransaction = transactions[flow.currentTransactionIndex]
  const currentStep =
    currentTransaction.status === 'success'
      ? flow.currentTransactionIndex + 1
      : flow.currentTransactionIndex
  const stepStatus =
    currentTransaction.status === 'pending' || currentTransaction.status === 'reverted'
      ? 'inProgress'
      : 'notStarted'

  return (
    <IntroStageModal
      stepStatus={stepStatus}
      currentStep={currentStep}
      onSuccess={() => setFlowStage('transaction')}
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
  const transactions = useTransactionManager((s) => s.getFlowTransactions(flow.flowId))
  const onDismiss = useTransactionManager((s) => s.stopCurrentFlow)
  const currentTransaction = transactions[flow.currentTransactionIndex]
  const userTransaction = userTransactions[currentTransaction.name]

  const displayItems = userTransaction.displayItems(currentTransaction.data as never, t)

  return (
    <TransactionStageModal
      backToInput={'backToInput' in userTransaction ? !!userTransaction.backToInput : false}
      currentTransactionIndex={flow.currentTransactionIndex}
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
    return (
      <InputContent
        flow={flow as StoredFlow & { input: GenericTransactionInput<TransactionInputName> }}
      />
    )
  if (flow.intro && flow.currentStage === 'intro')
    return <IntroContent flow={flow as StoredFlow & { intro: TransactionIntro }} />
  return <TransactionContent flow={flow} />
}

export const TransactionDialogManager = () => {
  const { flow, isPrevious } = useTransactionManager((s) => s.getCurrentOrPreviousFlow())
  const stopFlow = useTransactionManager((s) => s.stopCurrentFlow)
  const attemptDismiss = useTransactionManager((s) => s.attemptCurrentFlowDismiss)

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
