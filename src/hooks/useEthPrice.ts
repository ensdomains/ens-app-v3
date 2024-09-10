import { Address } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'

import { useAddressRecord } from './ensjs/public/useAddressRecord'

const ORACLE_ENS = 'eth-usd.data.eth'
const ORACLE_SEPOLIA = '0x694AA1769357215DE4FAC081bf1f309aDC325306' as const

export const useEthPrice = () => {
  const chainId = useChainId()

  const { data: address_ } = useAddressRecord({
    name: ORACLE_ENS,
    enabled: chainId !== sepolia.id,
  })

  const address = chainId === 11155111 ? ORACLE_SEPOLIA : (address_?.value as Address) || undefined

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
