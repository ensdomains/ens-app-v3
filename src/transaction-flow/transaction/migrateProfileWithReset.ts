import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { bustAvatarCache, bustHeaderCache } from '@app/utils/bustMetadataCache'
import { profileRecordsToKeyValue, recordsWithCointypeCoins } from '@app/utils/records'

type Data = {
  name: string
  resolverAddress: Address
}

const displayItems = ({ name }: Data, t: TFunction): TransactionDisplayItem[] => {
  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    {
      label: 'action',
      value: t('transaction.description.migrateProfileWithReset'),
    },
    {
      label: 'info',
      value: t('transaction.info.migrateProfileWithReset'),
    },
  ]
}

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const { name, resolverAddress } = data
  const subgraphRecords = await getSubgraphRecords(client, {
    name,
    resolverAddress,
  })
  const profile = await getRecords(client, {
    name,
    texts: subgraphRecords?.texts || [],
    coins: subgraphRecords?.coins || [],
    abi: true,
    contentHash: true,
    resolver: resolverAddress
      ? {
          address: resolverAddress,
          fallbackOnly: false,
        }
      : undefined,
  })

  const profileRecords = await profileRecordsToKeyValue(profile)
  const latestResolverAddress = getChainContractAddress({
    client,
    contract: 'ensPublicResolver',
  })

  // Check if avatar or header are being migrated
  const hasAvatarChange = profile?.texts?.some((t) => t.key === 'avatar')
  const hasHeaderChange = profile?.texts?.some((t) => t.key === 'header')

  // Bust cache for migrated media records
  if (hasAvatarChange) bustAvatarCache(name, client)
  if (hasHeaderChange) bustHeaderCache(name, client)

  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    ...recordsWithCointypeCoins(profileRecords),
    clearRecords: true,
    resolverAddress: latestResolverAddress,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
