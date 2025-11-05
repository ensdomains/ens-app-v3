import type { TFunction } from 'react-i18next'
import type { Address } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { bustAvatarCache, bustHeaderCache } from '@app/utils/bustMetadataCache'
import { profileRecordsToKeyValue, recordsWithCointypeCoins } from '@app/utils/records'

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

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const subgraphRecords = await getSubgraphRecords(client, data)
  if (!subgraphRecords) throw new Error('No subgraph records found')
  const profile = await getRecords(connectorClient, {
    name: data.name,
    texts: subgraphRecords.texts,
    coins: subgraphRecords.coins,
    abi: true,
    contentHash: true,
    resolver: data.resolverAddress
      ? {
          address: data.resolverAddress,
          fallbackOnly: false,
        }
      : undefined,
  })
  const resolverAddress = getChainContractAddress({
    client,
    contract: 'ensPublicResolver',
  })
  if (!profile) throw new Error('No profile found')
  const records = await profileRecordsToKeyValue(profile)

  // Check if avatar or header are being migrated
  const hasAvatarChange = profile.texts?.some((t) => t.key === 'avatar')
  const hasHeaderChange = profile.texts?.some((t) => t.key === 'header')

  // Bust cache for migrated media records
  if (hasAvatarChange) bustAvatarCache(data.name, client)
  if (hasHeaderChange) bustHeaderCache(data.name, client)

  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    resolverAddress,
    ...recordsWithCointypeCoins(records),
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
