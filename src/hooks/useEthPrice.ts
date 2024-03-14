import { Address } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { goerli } from 'wagmi/chains'

import { useAddressRecord } from './ensjs/public/useAddressRecord'

const ORACLE_ENS = 'eth-usd.data.eth'
const ORACLE_GOERLI = '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e' as const

export const useEthPrice = () => {
  const chainId = useChainId()

  const { data: address_ } = useAddressRecord({
    name: ORACLE_ENS,
    enabled: chainId !== goerli.id,
  })

  const address = chainId === 5 ? ORACLE_GOERLI : (address_?.value as Address) || undefined

  return useReadContract({
    abi: [
      {
        inputs: [],
        name: 'latestAnswer',
        outputs: [{ name: '', type: 'int256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    address,
    functionName: 'latestAnswer',
  })
}
