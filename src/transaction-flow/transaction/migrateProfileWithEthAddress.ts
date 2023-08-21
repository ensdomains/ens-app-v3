import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { getABISafely, normaliseABI } from '@app/hooks/useGetABI'
import { PublicENS, Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { makeProfileRecordsWithEthRecordItem, profileRecordsToKeyValue } from '@app/utils/records'
import { Address } from 'viem'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { getRecords } from '@ensdomains/ensjs/public'
import { getChainContractAddress } from '@ensdomains/ensjs/contracts'

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

const transaction = async (
  {
    publicClient,
    data,
  }: TransactionFunctionParameters<Data>,
) => {
  const subgraphRecords = await getSubgraphRecords(publicClient, { name: data.name, resolverAddress: data.resolverAddress })
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
  const latestResolverAddress = getChainContractAddress({ client: publicClient, contract: 'ensPublicResolver' })

  const profileRecords = makeProfileRecordsWithEthRecordItem(profile?.records, ethAddress)
  const records = profileRecordsToKeyValue(profileRecords, abi)

  return ens.setRecords.populateTransaction(name, {
    records,
    resolverAddress: latestResolverAddress,
    signer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
