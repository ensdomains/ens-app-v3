import { Address } from 'viem'
import { useReadContract } from 'wagmi'

import { useAddressRecord } from './ensjs/public/useAddressRecord'

const ORACLE_ENS = 'eth-usd.data.eth'

export const useEthPrice = () => {
  const { data: addressResult } = useAddressRecord({
    name: ORACLE_ENS,
  })

  const address = (addressResult?.value as Address) ?? undefined

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
