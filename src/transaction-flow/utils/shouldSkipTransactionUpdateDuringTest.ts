import { TransactionData, TransactionName } from '../transaction'
import { GenericTransaction } from '../types'
import { isTransaction } from './isTransaction'

// This function is used to skip a transaction update during testing on a local chain environment.
export const shouldSkipTransactionUpdateDuringTest = (
  transaction: GenericTransaction<TransactionName, TransactionData<TransactionName>>,
) => {
  return (
    process.env.NEXT_PUBLIC_ETH_NODE === 'anvil' &&
    (isTransaction('commitName')(transaction) || isTransaction('registerName')(transaction)) &&
    transaction.data?.name?.startsWith('stuck-commit')
  )
}
