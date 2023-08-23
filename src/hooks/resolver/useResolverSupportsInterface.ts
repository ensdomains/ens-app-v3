import { Contract } from '@ethersproject/contracts'
import { useQuery } from 'wagmi'

type Input = {
  resolverAddress?: string
  interfaces: string[]
}

type Options = {
  enabled?: boolean
}

export const useResolverSupportsInterfaces = (
  { resolverAddress, interfaces }: Input,
  options: Options = {},
) => {
  const enabled = (options.enabled ?? true) && !!resolverAddress
  return useQuery(
    [`supports-interfaces-`],
    async () => {
      const contract = new Contract(resolverAddress!, [], undefined)
      const results = await Promise.allSettled(interfaces.map((i) => contract.supportsInterface(i)))
      return results.map((r) => r.status === 'fulfilled' && !!r.value)
    },
    {
      enabled,
    },
  )
}
