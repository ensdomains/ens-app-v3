import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { profileRecordsToKeyValue } from '@app/utils/records'

import { getABISafely, normaliseABI } from '../../hooks/useGetABI'

type Data = {
  name: string
  resolverAddress?: string
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t(`transaction.description.migrateProfile`),
  },
  {
    label: 'info',
    value: t(`transaction.info.migrateProfile`),
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const options = data.resolverAddress ? { resolverAddress: data.resolverAddress } : undefined
  const profile = await ens.getProfile(data.name, options)
  const abiData = await getABISafely(ens.getABI)(data.name)
  const abi = normaliseABI(abiData)
  const resolverAddress = (await ens.contracts!.getPublicResolver()!).address
  if (!profile) throw new Error('No profile found')
  if (!profile.records) throw new Error('No records found')
  const records = profileRecordsToKeyValue(profile.records, abi)
  return ens.setRecords.populateTransaction(data.name, {
    records,
    resolverAddress,
    signer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
