import { useAccount, useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { checkIsSafeApp } from '@app/utils/safe'

export const useIsSafeApp = () => {
  const { connector } = useAccount()
  return useQuery(
    useQueryKeys().isSafeApp(connector?.id),
    async () => {
      return checkIsSafeApp(connector)
    },
    {
      enabled: !!connector,
    },
  )
}
