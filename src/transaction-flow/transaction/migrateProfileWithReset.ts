import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { profileRecordsToKeyValue } from '@app/utils/records'

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

  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    ...profileRecords,
    clearRecords: true,
    resolverAddress: latestResolverAddress,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
