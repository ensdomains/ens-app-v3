import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useQuery, useSigner } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

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

const checkInterface = async (contract: Contract) => {
  try {
    const supportsInterface = await contract.supportsInterface('0xf1cb7e06')
    if (!supportsInterface) throw new Error('No interface')
  } catch (e: unknown) {
    console.error(e)
    throw new Error('notValid')
  }
}

const checkAuthorization = async (contract: Contract, name: string) => {
  try {
    const estGas = await contract.estimateGas.setAddr(
      namehash(name),
      BigNumber.from('60'),
      '0x0000000000000000000000000000000000000000',
    )
    if (!estGas) throw new Error('No gas')
  } catch (e: unknown) {
    console.error(e)
    throw new Error('notAuthorized')
  }
}

export const useResolverIsAuthorized = (name: string, resolver?: string) => {
  const { data: signer, isLoading: isSignerLoading } = useSigner()
  const { data, isLoading } = useQuery(
    useQueryKeys().resolverIsAuthorized(name, resolver!),
    async () => {
      try {
        const contract = new Contract(resolver!, setAddrABI, signer!)
        await checkInterface(contract)
        await checkAuthorization(contract, name)
      } catch (e: unknown) {
        console.error(e)
        if (e instanceof Error && e.message === 'notAuthorized') {
          return { isValid: true, isAuthorized: false }
        }
        return { isValid: false, isAuthorized: false }
      }

      return { isValid: true, isAuthorized: true }
    },
    {
      enabled: !!name && !!resolver && !!signer && !isSignerLoading,
    },
  )

  return {
    isAuthorized: !!data?.isAuthorized,
    isValid: !!data?.isValid,
    isLoading,
  }
}
