import type { TransactionData, TransactionName } from '../transaction'
import type { GenericTransaction } from '../types'

export const isTransaction =
  <TName extends TransactionName>(name: TName) =>
  (
    transaction: GenericTransaction<TransactionName, TransactionData<TransactionName>>,
  ): transaction is GenericTransaction<TName, TransactionData<TName>> => {
    return transaction?.name === name
  }
