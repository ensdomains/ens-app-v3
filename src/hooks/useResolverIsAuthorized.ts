import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useProvider, useQuery, useSigner } from 'wagmi'

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
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceID',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const useResolverIsAuthorized = (name: string, resolver?: string) => {
  const { data: signer, isLoading: isSignerLoading } = useSigner()
  const { data, isLoading } = useQuery(
    ['resolverIsAuthorised', name, resolver],
    async () => {
      try {
        console.log(name, resolver, isSignerLoading)
        const contract = new Contract(resolver!, setAddrABI, signer!)

        const check = await contract.supportsInterface('0xf1cb7e06')
        console.log('supportsInterface', check)
        console.log('resolver', contract.address, contract)
        await contract.estimateGas.setAddr(
          namehash(name),
          BigNumber.from('60'),
          '0x0000000000000000000000000000000000000000',
        )

        return true
      } catch (e) {
        console.error(e)
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
