import type { TFunction } from 'react-i18next'
import { Address, getAddress, isAddressEqual } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getResolver } from '@ensdomains/ensjs/public'
import { setAddressRecord } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { emptyAddress } from '@app/utils/constants'

type Data = {
  name: string
  address: Address
  latestResolver?: boolean
  /**
   * Pinned write target, judged by the caller — the underlying resolver when
   * the name is abstracted. Falls back to a registry lookup when absent, and
   * is ignored when `latestResolver` is set (an explicit go-to-latest always
   * targets the latest public resolver).
   */
  resolverAddress?: Address
}

const displayItems = (
  { name, address, latestResolver }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'info',
    value: latestResolver
      ? t(`transaction.info.updateEthAddressOnLatestResolver`)
      : t(`transaction.info.updateEthAddress`),
  },
  {
    label: 'address',
    value: address,
    type: 'address',
  },
]

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  // A pinned zero address is not a resolver; fall through to looking one up so
  // the guard below reports "no resolver" rather than building a transaction
  // aimed at the zero address.
  const pinnedResolverAddress =
    data.resolverAddress && !isAddressEqual(data.resolverAddress, emptyAddress)
      ? data.resolverAddress
      : undefined
  const resolverAddress = data?.latestResolver
    ? getChainContractAddress({ client, contract: 'ensPublicResolver' })
    : pinnedResolverAddress ?? (await getResolver(client, { name: data.name }))
  if (!resolverAddress) throw new Error('No resolver found')
  let address
  try {
    address = getAddress(data.address)
  } catch (e) {
    throw new Error('Invalid address')
  }
  return setAddressRecord.makeFunctionData(connectorClient, {
    name: data.name,
    resolverAddress,
    coin: 'eth',
    value: address,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
