import { Contract } from '@ethersproject/contracts'
import { useProvider, useQuery } from 'wagmi'

import { RESOLVER_INTERFACE_IDS, ResolverInterfaceName } from '@app/constants/resolverInterfaceIds'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

const SUPPORTS_INTERFACE_ABI = [
  {
    constant: true,
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
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
]

type Input = {
  resolverAddress?: string
  interfaces: ResolverInterfaceName[]
}

type Options = {
  enabled?: boolean
}

export const useResolverSupportsInterfaces = (
  { resolverAddress, interfaces }: Input,
  options: Options = {},
) => {
  const enabled = (options.enabled ?? true) && !!resolverAddress
  const provider = useProvider()
  return useQuery(
    useQueryKeys().resolverSupportsInterfaces(resolverAddress!, interfaces),
    async () => {
      const _interfaces = interfaces.map((i) => [i, RESOLVER_INTERFACE_IDS[i]])
      const contract = new Contract(resolverAddress!, SUPPORTS_INTERFACE_ABI, provider)
      const results = await Promise.allSettled(
        _interfaces.map(async ([i, id]) => {
          try {
            const supported = await contract.supportsInterface(id)
            return [i, supported]
          } catch {
            return [i, false]
          }
        }),
      )
      const entries = results
        .map((r) => (r.status === 'fulfilled' ? r.value : null))
        .filter((r) => !!r) as [ResolverInterfaceName, boolean][]
      return Object.fromEntries(entries)
    },
    {
      enabled: enabled && !!provider,
    },
  )
}
