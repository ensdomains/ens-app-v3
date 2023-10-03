import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { makeProfileRecordsWithEthRecordItem, profileRecordsToKeyValue } from '@app/utils/records'

type Data = {
  name: string
  ethAddress: Address
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
    value: t(`transaction.description.migrateProfileWithEthAddress`),
  },
  {
    label: 'info',
    value: t(`transaction.info.migrateProfile`),
  },
]

const transaction = async ({
  publicClient,
  walletClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const subgraphRecords = await getSubgraphRecords(publicClient, {
    name: data.name,
    resolverAddress: data.resolverAddress,
  })
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
  const latestResolverAddress = getChainContractAddress({
    client: publicClient,
    contract: 'ensPublicResolver',
  })

  const profileRecords = makeProfileRecordsWithEthRecordItem(profile, data.ethAddress)
  const records = await profileRecordsToKeyValue(profileRecords)

  return setRecords.makeFunctionData(walletClient, {
    name: data.name,
    resolverAddress: latestResolverAddress,
    ...records,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
