import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

import { shortenAddress } from '../../utils/utils'

type Data = {
  name: string
  contract: 'registry' | 'nameWrapper'
  resolver: string
  oldResolver?: string
}

const displayItems = (
  { name, resolver }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t(`transaction.description.updateResolver`),
  },
  {
    label: 'info',
    value: [t(`transaction.info.updateResolver`), shortenAddress(resolver)],
    type: 'list',
  },
]

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.setResolver.populateTransaction(data.name, {
    contract: data.contract,
    resolver: data.resolver,
    signer,
  })

export default { displayItems, transaction } as Transaction<Data>
