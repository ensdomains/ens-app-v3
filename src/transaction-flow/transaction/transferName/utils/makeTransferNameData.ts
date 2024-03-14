import { match } from 'ts-pattern'

import type { Data } from '../../transferName'

type MakeTransferNameData = {
  name: Data['name']
  newOwnerAddress: Data['newOwnerAddress']
  sendType: Data['sendType']
  contract: Data['contract']
  reclaim: Data['reclaim']
}

export const makeTransferNameData = ({
  name,
  newOwnerAddress,
  sendType,
  contract,
  reclaim,
}: MakeTransferNameData): Data => {
  return match(contract)
    .with('registrar', () => ({
      name,
      newOwnerAddress,
      contract: 'registrar' as const,
      sendType,
      reclaim,
    }))
    .otherwise((contract_: 'registry' | 'nameWrapper') => ({
      name,
      newOwnerAddress,
      contract: contract_,
      sendType,
    }))
}
