import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { getABISafely, normaliseABI } from '@app/hooks/useGetABI'
import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { makeProfileRecordsWithEthRecordItem, profileRecordsToKeyValue } from '@app/utils/records'

type Data = {
  name: string
  ethAddress: string
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
    value: t(`transaction.description.migrateProfileWithEthAddress`),
  },
  {
    label: 'info',
    value: t(`transaction.info.migrateProfile`),
  },
]

const transaction = async (
  signer: JsonRpcSigner,
  ens: PublicENS,
  { name, ethAddress, resolverAddress }: Data,
) => {
  const profile = await ens.getProfile(name, resolverAddress ? { resolverAddress } : undefined)
  const abiData = await getABISafely(ens.getABI)(name)
  const abi = normaliseABI(abiData)
  const latestResolverAddress = (await ens.contracts!.getPublicResolver()!).address

  const profileRecords = makeProfileRecordsWithEthRecordItem(profile?.records, ethAddress)
  const records = profileRecordsToKeyValue(profileRecords, abi)

  return ens.setRecords.populateTransaction(name, {
    records,
    resolverAddress: latestResolverAddress,
    signer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
