import { Hash } from 'viem'

import { useTransactionManager } from '@app/transaction/transactionManager'

import { UseVerificationOAuthReturnType } from '../../useVerificationOAuth/useVerificationOAuth'

type Props = Pick<
  UseVerificationOAuthReturnType,
  'name' | 'verifier' | 'resolverAddress' | 'verifiedPresentationUri'
> & {
  userAddress?: Hash
  router?: any
}

export const createVerificationTransactionFlow = ({
  name,
  verifier,
  verifiedPresentationUri,
  resolverAddress,
}: Props) => {
  if (!name || !verifier || !verifiedPresentationUri || !resolverAddress) return

  useTransactionManager.getState().startFlow({
    flowId: `update-verification-record-${name}`,
    transactions: [
      {
        name: 'updateVerificationRecord',
        data: {
          name,
          verifier,
          resolverAddress,
          verifiedPresentationUri,
        },
      },
    ],
  })
}
