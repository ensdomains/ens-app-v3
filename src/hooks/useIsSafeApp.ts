import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { checkIsSafeApp } from '@app/utils/safe'

import { useQueryKeyFactory } from './useQueryKeyFactory'

export const useIsSafeApp = () => {
  const { connector } = useAccount()
  const queryKey = useQueryKeyFactory({
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
