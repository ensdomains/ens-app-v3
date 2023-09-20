import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useQuery, useSigner } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useChainId } from '@app/hooks/useChainId'
import { useProfile } from '@app/hooks/useProfile'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { NAMEWRAPPER_AWARE_RESOLVERS, RESOLVER_ADDRESSES, emptyAddress } from '@app/utils/constants'

import { useBasicName } from '../useBasicName'

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

const checkIsKnownValidResolver = (resolverAddress: string, chainId: number) => {
  return RESOLVER_ADDRESSES[`${chainId}`].includes(resolverAddress)
}

const checkIsKnownAuthorizedResolver = (
  resolverAddress: string,
  isWrapped: boolean,
  chainId: number,
) => {
  if (isWrapped) {
    return NAMEWRAPPER_AWARE_RESOLVERS[`${chainId}`].includes(resolverAddress)
  }
  return true
}

export const checkInterface = async (contract: Contract) => {
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

type Options = {
  enabled?: boolean
}

export const useResolverIsAuthorized = (name?: string, options: Options = {}) => {
  const enabled = (options.enabled ?? true) && !!name

  const signer = useSigner()

  const chainId = useChainId()

  const profile = useProfile(name!, {
    skip: !enabled,
  })
  const resolverAddress = profile.profile?.resolverAddress ?? ''

  const basicName = useBasicName(name, {
    enabled,
    skipGraph: true,
  })
  const { isWrapped } = basicName

  const isLoading = profile.loading || signer.isLoading

  return useQuery(
    useQueryKeys().resolverIsAuthorized(name!, resolverAddress!),
    async () => {
      try {
        if (!name || !chainId || !resolverAddress || resolverAddress === emptyAddress)
          return { isValid: false, isAuthorized: false }

        // If the resolver is known, skip the checks
        if (checkIsKnownValidResolver(resolverAddress, chainId)) {
          return {
            isValid: true,
            isAuthorized: checkIsKnownAuthorizedResolver(resolverAddress, isWrapped, chainId),
          }
        }

        const contract = new Contract(resolverAddress!, setAddrABI, signer.data!)
        await checkInterface(contract)
        await checkAuthorization(contract, name)
        return { isValid: true, isAuthorized: true }
      } catch (e: unknown) {
        console.error(e)
        if (e instanceof Error && e.message === 'notAuthorized') {
          return { isValid: true, isAuthorized: false }
        }
        return { isValid: false, isAuthorized: false }
      }
    },
    {
      enabled: enabled && !isLoading && !!signer.data && !!resolverAddress,
    },
  )
}
