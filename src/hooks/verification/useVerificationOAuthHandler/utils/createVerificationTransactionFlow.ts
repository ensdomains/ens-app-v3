import { Hash } from 'viem'

import { createTransactionItem } from '@app/transaction-flow/transaction'
import { CreateTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { UseDentityProfileReturnType } from '../../useDentityProfile/useDentityProfile'

type Props = Pick<
  UseDentityProfileReturnType,
  'name' | 'verifier' | 'resolverAddress' | 'verifiedPresentationUri'
> & {
  userAddress?: Hash
  router?: any
  createTransactionFlow?: CreateTransactionFlow
}

export const createVerificationTransactionFlow = ({
  name,
  verifier,
  verifiedPresentationUri,
  resolverAddress,
  createTransactionFlow,
}: Props) => {
  if (!name || !createTransactionFlow || !verifier || !verifiedPresentationUri || !resolverAddress)
    return
  createTransactionFlow?.(`update-verification-record-${name}`, {
    transactions: [
      createTransactionItem('updateVerificationRecord', {
        name,
        verifier,
        resolverAddress,
        verifiedPresentationUri,
      }),
    ],
  })
}
