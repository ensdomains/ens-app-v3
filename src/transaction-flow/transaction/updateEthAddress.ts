import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  address: string
  latestResolver?: boolean
}

const displayItems = (
  { name, address, latestResolver }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'info',
    value: latestResolver
      ? t(`transaction.info.updateEthAddressOnLatestResolver`)
      : t(`transaction.info.updateEthAddress`),
  },
  {
    label: 'address',
    value: address,
    type: 'address',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const resolverAddress = data?.latestResolver
    ? (await ens.contracts!.getPublicResolver()).address
    : undefined
  return ens.setRecord.populateTransaction(data.name, {
    signer,
    record: { key: 'ETH', value: data.address },
    type: 'addr',
    resolverAddress,
  })
}

const exports = { displayItems, transaction } as Transaction<Data>

export default exports
