import { queryOptions } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { useQuery } from '@app/utils/query/useQuery'
import { checkIsSafeApp } from '@app/utils/safe'

import { useQueryOptions } from './useQueryOptions'

export const useIsSafeApp = () => {
  const { connector } = useAccount()
  const initialOptions = useQueryOptions({
    params: { id: connector?.id },
    functionName: 'isSafeApp',
    queryDependencyType: 'independent',
    queryFn: async () => checkIsSafeApp(connector),
  })
  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })
  return useQuery({
    ...preparedOptions,
    enabled: !!connector,
  })
}
