import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useQuery, useSigner } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

const setAddrABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'node',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'coinType',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'a',
        type: 'bytes',
      },
    ],
    name: 'setAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const useResolverIsAuthorized = (name: string, resolver?: string) => {
  const { data: signer, isLoading: isSignerLoading } = useSigner()

  const { data, isLoading } = useQuery(
    ['resolverIsAuthorised', name, resolver],
    async () => {
      try {
        const contract = new Contract(resolver!, setAddrABI, signer!)
        await contract.estimateGas.setAddr(
          namehash(name),
          BigNumber.from(60),
          '0x0000000000000000000000000000000000000000',
        )
        return true
      } catch {
        return false
      }
    },
    {
      enabled: !!name && !!resolver && !!signer && !isSignerLoading,
    },
  )

  return {
    isAuthorized: !!data,
    isLoading,
  }
}
