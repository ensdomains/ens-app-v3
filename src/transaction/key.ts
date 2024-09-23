import type { FlowKey, StoredFlow } from './slices/createFlowSlice'
import type { StoredTransaction, TransactionKey } from './slices/createTransactionSlice'

export const getFlowKey = (
  flow: Pick<StoredFlow, 'flowId' | 'sourceChainId' | 'account'>,
): FlowKey => JSON.stringify([flow.flowId, flow.sourceChainId, flow.account]) as FlowKey
export const getTransactionKey = ({
  transactionId,
  flowId,
  sourceChainId,
  account,
}: Pick<
  StoredTransaction,
  'transactionId' | 'flowId' | 'sourceChainId' | 'account'
>): TransactionKey =>
  JSON.stringify([transactionId, flowId, sourceChainId, account]) as TransactionKey
