import type { TFunction } from 'react-i18next'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { profileRecordsToKeyValue, recordsWithCointypeCoins } from '@app/utils/records'

import { hasRecordsToMigrate } from './utils/hasRecordsToMigrate'

type Data = {
  name: string
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
  const { name } = data
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
  // Read through the UniversalResolver, unpinned. A pinned read becomes a direct
  // text()/addr() multicall that bypasses ENSIP-10 resolve(), which is the only
  // way a wildcard, CCIP-Read or L2-backed resolver answers — and the resolver
  // behind a mirror can be exactly that, since the mirror resolves through the
  // v1 registry and inherits an ancestor's wildcard resolver. Unpinned, an
  // abstracted name still reads correctly: the mirror's resolve() forwards to
  // the resolver behind it. This also matches the gate that offered the option,
  // which reads the same way.
  const profile = await getRecords(client, {
    name,
    texts: subgraphRecords?.texts || [],
    coins: subgraphRecords?.coins || [],
    abi: true,
    contentHash: true,
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
