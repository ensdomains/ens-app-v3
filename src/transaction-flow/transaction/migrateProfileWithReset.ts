import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
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

  // This flow clears the target resolver before writing, so an empty source
  // result (e.g. the subgraph does not key the records by the supplied
  // resolver address) would wipe the profile silently — fail visibly instead.
  const hasRecordsToMigrate =
    (profile.texts?.length ?? 0) > 0 ||
    (profile.coins?.length ?? 0) > 0 ||
    !!profile.contentHash ||
    !!profile.abi
  if (!hasRecordsToMigrate) throw new Error('No records found to migrate')

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
