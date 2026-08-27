import type { TFunction } from 'react-i18next'
import type { Address } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { profileRecordsToKeyValue, recordsWithCointypeCoins } from '@app/utils/records'
import { getUnderlyingResolver } from '@app/utils/resolver/getUnderlyingResolver'

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
  const sourceResolverAddress = data.resolverAddress
    ? (await getUnderlyingResolver(client, {
        name: data.name,
        resolverAddress: data.resolverAddress,
      })) ?? data.resolverAddress
    : undefined
  const subgraphRecords = await getSubgraphRecords(client, {
    ...data,
    resolverAddress: sourceResolverAddress,
  })
  if (!subgraphRecords) throw new Error('No subgraph records found')
  const profile = await getRecords(connectorClient, {
    name: data.name,
    texts: subgraphRecords.texts,
    coins: subgraphRecords.coins,
    abi: true,
    contentHash: true,
    resolver: sourceResolverAddress
      ? {
          address: sourceResolverAddress,
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

  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    resolverAddress,
    ...recordsWithCointypeCoins(records),
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
