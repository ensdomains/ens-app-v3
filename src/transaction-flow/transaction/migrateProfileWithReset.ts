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
  publicClient,
  walletClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const subgraphRecords = await getSubgraphRecords(publicClient, { name: data.name })
  const profile = await getRecords(publicClient, {
    name: data.name,
    records: {
      ...subgraphRecords,
      abi: true,
      contentHash: true,
    },
    resolver: data.resolverAddress
      ? {
          address: data.resolverAddress,
          fallbackOnly: false,
        }
      : undefined,
  })

  const profileRecords = profileRecordsToKeyValue(profile)
  const latestResolverAddress = getChainContractAddress({
    client: publicClient,
    contract: 'ensPublicResolver',
  })

  return setRecords.makeFunctionData(walletClient, {
    name: data.name,
    ...profileRecords,
    clearRecords: true,
    resolverAddress: latestResolverAddress,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
