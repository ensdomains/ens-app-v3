import { Address } from 'viem'
import { useContractRead } from 'wagmi'

import { useAddressRecord } from './ensjs/public/useAddressRecord'
import { usePublicClient } from './usePublicClient'

const ORACLE_ENS = 'eth-usd.data.eth'
const ORACLE_GOERLI = '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e' as const

export const useEthPrice = () => {
  const publicClient = usePublicClient()

  const { data: address_ } = useAddressRecord({
    name: ORACLE_ENS,
    enabled: publicClient.chain.id !== 5,
  })

  const address =
    publicClient.chain.id === 5 ? ORACLE_GOERLI : (address_?.value as Address) || undefined

  return useContractRead({
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
    select: (r) => BigInt(r),
  })
}
