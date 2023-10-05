import { useAccount, useQuery } from 'wagmi'

import { checkIsSafeApp } from '@app/utils/safe'

import { useQueryKeyFactory } from './useQueryKeyFactory'

export const useIsSafeApp = () => {
  const { connector } = useAccount()
  const queryKey = useQueryKeyFactory({
    params: { id: connector?.id },
    functionName: 'isSafeApp',
    queryDependencyType: 'independent',
  })
  return useQuery(
    queryKey,
    async () => {
      return checkIsSafeApp(connector)
    },
    {
      enabled: !!connector,
    },
  )
}
