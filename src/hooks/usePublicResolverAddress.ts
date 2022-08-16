import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from 'react-query'

export const usePublicResolverAddress = () => {
  const { ready, contracts } = useEns()

  const { data: address, isLoading: loading } = useQuery(
    'publicResolver',
    async () => {
      const resolver = await contracts?.getPublicResolver()
      return resolver?.address
    },
    {
      enabled: ready && !!contracts,
    },
  )

  return {
    loading,
    address,
  }
}
