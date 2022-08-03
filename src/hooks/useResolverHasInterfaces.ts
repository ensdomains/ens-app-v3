import { ContractInterface } from '@app/validators/validateContract'
import { useQuery } from 'react-query'
import { useProvider, useNetwork } from 'wagmi'
import validateResolver from '../validators/validateResolver'

export const useResolverHasInterfaces = (
  interfaceNames: ContractInterface[],
  resolverAddress?: string,
  skip?: boolean,
) => {
  const provider = useProvider()
  const { activeChain } = useNetwork()
  const {
    data: hasInterface,
    isLoading,
    status,
  } = useQuery(
    ['validateResolver', resolverAddress, interfaceNames.join(','), activeChain?.id],
    async () => {
      const results = await validateResolver(interfaceNames, resolverAddress!, provider, {
        networkId: activeChain!.id,
      })
      return results.length === 0
    },
    {
      enabled: !!activeChain && !skip && !!resolverAddress,
    },
  )
  return {
    hasInterface,
    isLoading,
    status,
  }
}
