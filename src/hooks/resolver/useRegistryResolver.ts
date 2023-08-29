import { namehash } from 'viem'
import { useContractRead } from 'wagmi'

import { getChainContractAddress, registryResolverSnippet } from '@ensdomains/ensjs/contracts'

import { usePublicClient } from '../usePublicClient'

type UseRegistryResolverParameters = {
  name: string

  enabled?: boolean
}

export const useRegistryResolver = ({ name, enabled = true }: UseRegistryResolverParameters) => {
  const publicClient = usePublicClient()
  return useContractRead({
    abi: registryResolverSnippet,
    address: getChainContractAddress({ client: publicClient, contract: 'ensRegistry' }),
    functionName: 'resolver',
    args: [namehash(name)],
    enabled: enabled && !!name,
  })
}
