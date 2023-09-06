import type { Address } from 'viem'
import { useQuery } from 'wagmi'

import { GetNameParameters, getName } from '@ensdomains/ensjs/public'

import { tryBeautify } from '@app/utils/beautify'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UsePrimaryNameParameters = Omit<GetNameParameters, 'address'> & {
  address?: Address

  allowMismatch?: boolean

  enabled?: boolean
}

export const usePrimaryName = <TParams extends UsePrimaryNameParameters>({
  enabled = true,
  allowMismatch = false,
  ...params
}: TParams) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(
    queryKeys.getName({ ...params, address: params.address!, allowMismatch }),
    async ({ queryKey: [params] }) => {
      const res = await getName(publicClient, params as GetNameParameters)
      if (!res || !res.name || (!res.match && !allowMismatch)) return null
      return {
        ...res,
        name: res.name as string | undefined,
        beautifiedName: tryBeautify(res.name),
      }
    },
    {
      enabled: enabled && !!params.address,
      cacheTime: 60,
    },
  )

  return {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
