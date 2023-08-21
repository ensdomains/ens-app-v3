import { Address } from 'viem'
import { useQuery } from 'wagmi'

import { getAddressRecord } from '@ensdomains/ensjs/public'

import { PublicClientWithChain } from '@app/types'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from './usePublicClient'

const ORACLE_ENS = 'eth-usd.data.eth'
const ORACLE_GOERLI = '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e' as const

const getEthPrice = async (client: PublicClientWithChain) => {
  const chainId = client.chain?.id ?? 1

  const address =
    chainId === 5
      ? ORACLE_GOERLI
      : await getAddressRecord(client, { name: ORACLE_ENS }).then(
          (v) => (v?.value as Address) ?? null,
        )

  if (!address) throw new Error('Contract address not found')

  return client.readContract({
    abi: [
      {
        inputs: [],
        name: 'latestAnswer',
        outputs: [{ name: '', type: 'int256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    address,
    functionName: 'latestAnswer',
  })
}

export const useEthPrice = () => {
  const publicClient = usePublicClient()

  return useQuery(useQueryKeys().ethPrice, () => getEthPrice(publicClient), {
    enabled: !!publicClient,
  })
}
