import type { TFunction } from 'react-i18next'
import { Address, getAddress } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getResolver } from '@ensdomains/ensjs/public'
import { setAddressRecord } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { getUnderlyingResolver } from '@app/utils/resolver/getUnderlyingResolver'

type Data = {
  name: string
  address: Address
  latestResolver?: boolean
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
  const registryResolverAddress = data?.latestResolver
    ? getChainContractAddress({ client, contract: 'ensPublicResolver' })
    : await getResolver(client, { name: data.name })
  if (!registryResolverAddress) throw new Error('No resolver found')
  // The latest public resolver is the target by construction; only a
  // registry-reported resolver can be an ENSv2 abstraction contract.
  const resolverAddress = data?.latestResolver
    ? registryResolverAddress
    : (await getUnderlyingResolver(client, {
        name: data.name,
        resolverAddress: registryResolverAddress,
      })) ?? registryResolverAddress
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
