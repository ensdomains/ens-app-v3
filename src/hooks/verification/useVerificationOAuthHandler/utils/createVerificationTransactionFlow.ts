import { Hash } from 'viem'

import { createTransactionItem } from '@app/transaction-flow/transaction'
import { CreateTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { UseVerificationOAuthReturnType } from '../../useVerificationOAuth/useVerificationOAuth'

type Props = Pick<
  UseVerificationOAuthReturnType,
  'verifier' | 'token' | 'name' | 'resolverAddress'
> & {
  userAddress?: Hash
  router?: any
  createTransactionFlow?: CreateTransactionFlow
}

export const createVerificationTransactionFlow = ({
  verifier,
  token,
  name,
  resolverAddress,
  createTransactionFlow,
}: Props) => {
  createTransactionFlow?.(`update-verification-record-${name}`, {
    transactions: [
      createTransactionItem('updateVerificationRecord', {
        name,
        resolverAddress,
        verifier,
        token,
      }),
    ],
  })
}
