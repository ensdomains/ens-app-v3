import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { checkIsSafeApp } from '@app/utils/safe'

import { useQueryOptions } from './useQueryOptions'

export const useIsSafeApp = () => {
  const { connector } = useAccount()
  const { queryKey } = useQueryOptions({
    params: { id: connector?.id },
    functionName: 'isSafeApp',
    queryDependencyType: 'independent',
  })
  return useQuery({
    queryKey,
    queryFn: async () => {
      return checkIsSafeApp(connector)
    },
    enabled: !!connector,
  })
}
