import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { setResolver } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { bustMediaCache } from '@app/utils/metadataCache'

import { shortenAddress } from '../../utils/utils'

type Data = {
  name: string
  contract: 'registry' | 'nameWrapper'
  resolverAddress: Address
  oldResolverAddress?: Address
}

const displayItems = (
  { name, resolverAddress }: Data,
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
    value: [t(`transaction.info.updateResolver`), shortenAddress(resolverAddress)],
    type: 'list',
  },
]

const transaction = ({ client, connectorClient, data }: TransactionFunctionParameters<Data>) => {
  // Bust cache for both avatar and header when changing resolver
  // The new resolver may have different records
  bustMediaCache(data.name, client)

  return setResolver.makeFunctionData(connectorClient, {
    name: data.name,
    contract: data.contract,
    resolverAddress: data.resolverAddress,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
