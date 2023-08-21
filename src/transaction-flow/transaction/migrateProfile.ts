import type { TFunction } from 'react-i18next'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { profileRecordsToKeyValue } from '@app/utils/records'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'
import type { Address } from 'viem'

type Data = {
  name: string
  resolverAddress?: Address
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

const transaction = async ({ publicClient, walletClient, data }: TransactionFunctionParameters<Data>) => {
  const subgraphRecords = await getSubgraphRecords(publicClient, data)
  if (!subgraphRecords) throw new Error('No subgraph records found')
  const profile = await getRecords(publicClient, { 
    name: data.name,
    records: {
      ...subgraphRecords,
      abi: true,
      contentHash: true,
    },
    resolver: data.resolverAddress ? {
      address: data.resolverAddress,
      fallbackOnly: false,
    } : undefined
   })
  const resolverAddress = getChainContractAddress({ client: publicClient, contract: 'ensPublicResolver' })
  if (!profile) throw new Error('No profile found')
  const records = await profileRecordsToKeyValue(profile)
  return setRecords.makeFunctionData(walletClient, {
    name: data.name,
    resolverAddress,
    ...records,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
