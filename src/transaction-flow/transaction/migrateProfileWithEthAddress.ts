import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { contentHashToString } from '@app/utils/contenthash'

type Data = {
  name: string
  ethAddress: string
  resolverAddress?: string
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name'
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
  signer: JsonRpcSigner,
  ens: PublicENS,
  { name, ethAddress, resolverAddress }: Data,
) => {
  const profile = await ens.getProfile(name, resolverAddress ? { resolverAddress } : undefined)
  const latestResolverAddress = (await ens.contracts!.getPublicResolver()!).address

  const contentHashString = contentHashToString(profile?.records?.contentHash)
  const records = {
    contentHash: contentHashString || undefined,
    texts: profile?.records?.texts as { key: string; value: string }[] | undefined,
    coinTypes: [
      ...(profile?.records?.coinTypes || [])
        .filter((coinType) => coinType.key !== 'ETH')
        .map((coinType) => ({
          key: coinType.key as string,
          value: (coinType as any).addr as string,
        })),
      {
        key: 'ETH',
        value: ethAddress,
      },
    ],
  }

  return ens.setRecords.populateTransaction(name, {
    records,
    resolverAddress: latestResolverAddress,
    signer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
