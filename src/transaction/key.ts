import type { FlowKey, StoredFlow, StoredTransaction, TransactionKey } from './types'

export const getFlowKey = (flow: Pick<StoredFlow, 'flowId' | 'chainId' | 'account'>): FlowKey =>
  JSON.stringify([flow.flowId, flow.chainId, flow.account]) as FlowKey
export const getTransactionKey = ({
  transactionId,
  flowId,
  chainId,
  account,
}: Pick<StoredTransaction, 'transactionId' | 'flowId' | 'chainId' | 'account'>): TransactionKey =>
  JSON.stringify([transactionId, flowId, chainId, account]) as TransactionKey
