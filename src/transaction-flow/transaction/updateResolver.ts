import type { TFunction } from 'react-i18next'
import { PublicENS, TransactionDisplayItem, Transaction } from '@app/types'
import type { JsonRpcSigner } from '@ethersproject/providers'

type Data = {
  name: string
  contract: 'registry' | 'nameWrapper'
  resolver: string
  oldResolver: string
}

const displayItems = (
  { resolver, oldResolver }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem<'address'>[] => [
  {
    label: 'action',
    value: t(`transaction.description.updateResolver`),
  },
  {
    label: 'info',
    value: t(`transaction.info.updateResolver`),
  },
  {
    label: 'currentResolver',
    value: oldResolver,
    type: 'address',
  },
  {
    label: 'newResolver',
    value: resolver,
    type: 'address',
  },
]

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.setResolver.populateTransaction(data.name, {
    contract: data.contract,
    resolver: data.resolver,
    signer,
  })

export default { displayItems, transaction } as Transaction<Data>
