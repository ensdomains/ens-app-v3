import { match, P } from 'ts-pattern'
import { Hash } from 'viem'

import { UseVerificationOAuthReturnType } from '../../useVerificationOAuth/useVerificationOAuth'

export const checkCanCompleteVerificationFlow =
  (userAddress?: Hash) => (resp: UseVerificationOAuthReturnType) => {
    return match(resp)
      .with({ resolverAddress: P.nullish }, () => {
        throw new Error('Resolver address is required to complete verification flow')
      })
      .with({ token: P.nullish }, () => {
        throw new Error('Token is required to complete verification flow')
      })
      .when(
        ({ owner, manager }) => [owner, manager].includes(userAddress),
        () => true,
      )
      .otherwise(() => false)
  }
