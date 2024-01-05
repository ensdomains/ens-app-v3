import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { emptyAddress } from '@app/utils/constants'

type Data = {
  name: string
  contract: 'nameWrapper' | 'registry'
  method?: 'setSubnodeOwner' | 'setRecord'
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'subname',
    value: name,
    type: 'subname',
  },
  {
    label: 'action',
    value: t(`transaction.description.deleteSubname`),
  },
  {
    label: 'info',
    value: [t('action.delete'), name],
    type: 'list',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  // TEMP FIX FOR REGISTRY SETRECORD, NOT PERMANENT!!!
  // THIS SHOULD BE IN ENSJS
  // TODO: REMOVE THIS
  if (data.contract === 'registry' && data.method === 'setRecord') {
    const registry = await ens.contracts!.getRegistry()
    return registry.populateTransaction.setRecord(
      namehash(data.name),
      emptyAddress,
      emptyAddress,
      0,
    )
  }
  return ens.deleteSubname.populateTransaction(data.name, {
    contract: data.contract,
    method: data.method,
    signer,
  })
}
export default {
  displayItems,
  transaction,
} as Transaction<Data>
