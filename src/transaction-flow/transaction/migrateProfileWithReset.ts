import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { profileRecordsToKeyValue, recordsWithCointypeCoins } from '@app/utils/records'

import { hasRecordsToMigrate } from './utils/hasRecordsToMigrate'

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
  // Key discovery and value reads come from different places on purpose: the
  // index says which records exist, the chain says what they hold (see the
  // wiki, knowledge/apps/resolution.md). Discovery is deliberately NOT keyed
  // by the pinned resolver — the subgraph keys its resolver entity by the
  // address in the v1 registry's NewResolver event, so an address-keyed lookup
  // silently returns an empty set whenever that disagrees with the live read,
  // losing every text and coin in the migration. The unkeyed query is also
  // what the editor's own "do I have a profile" gate uses, so the option the
  // dialog offers and the transaction it builds now agree. Values are still
  // read from the pinned resolver below.
  const subgraphRecords = await getSubgraphRecords(client, { name })
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

  if (!hasRecordsToMigrate(profile)) throw new Error('No records found to migrate')

  const profileRecords = await profileRecordsToKeyValue(profile)
  const latestResolverAddress = getChainContractAddress({
    client,
    contract: 'ensPublicResolver',
  })

  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    ...recordsWithCointypeCoins(profileRecords),
    clearRecords: true,
    resolverAddress: latestResolverAddress,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
