import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import type { useAbilities } from '@app/hooks/abilities/useAbilities'

import { createUserTransaction, UserTransaction } from '../../transaction'

type MakeTransferNameOrSubnameTransactionItemParams = {
  name: string
  newOwnerAddress: Address
  sendType: 'sendManager' | 'sendOwner'
  isOwnerOrManager: boolean
  abilities: ReturnType<typeof useAbilities>['data']
}

export const makeTransferNameOrSubnameTransactionItem = ({
  name,
  newOwnerAddress,
  sendType,
  isOwnerOrManager,
  abilities,
}: MakeTransferNameOrSubnameTransactionItemParams): UserTransaction | null => {
  return (
    match([
      isOwnerOrManager,
      sendType,
      abilities?.sendNameFunctionCallDetails?.[sendType]?.contract,
    ])
      .with([true, 'sendOwner', P.not(P.nullish)], ([, , contract]) =>
        createUserTransaction('transferName', {
          name,
          newOwnerAddress,
          sendType: 'sendOwner',
          contract,
        }),
      )
      .with([true, 'sendManager', 'registrar'], () =>
        createUserTransaction('transferName', {
          name,
          newOwnerAddress,
          sendType: 'sendManager',
          contract: 'registrar',
          reclaim: abilities?.sendNameFunctionCallDetails?.sendManager?.method === 'reclaim',
        }),
      )
      .with([true, 'sendManager', P.union('registry', 'nameWrapper')], ([, , contract]) =>
        createUserTransaction('transferName', {
          name,
          newOwnerAddress,
          sendType: 'sendManager',
          contract,
        }),
      )
      // A parent name can only transfer the manager
      .with([false, 'sendManager', P.union('registry', 'nameWrapper')], ([, , contract]) =>
        createUserTransaction('transferSubname', {
          name,
          newOwnerAddress,
          contract,
        }),
      )
      .otherwise(() => null)
  )
}
