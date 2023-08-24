import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { tryBeautify } from '@app/utils/beautify'
import { GetNameParameters, getName } from '@ensdomains/ensjs/public'
import { usePublicClient } from '../../usePublicClient'

type UsePrimaryNameParameters = GetNameParameters & {
  enabled?: boolean
}

export const usePrimaryName = <TParams extends UsePrimaryNameParameters>(
  { enabled = true, ...params }: TParams,
) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(queryKeys.getName(params), async ({ queryKey: [params] }) => {
    const res = await getName(publicClient, params)
    if (!res || !res.name || !res.match) return null
    return {
      ...res,
      name: res.name as string | undefined,
      beautifiedName: tryBeautify(res.name),
    }
  }, {
    enabled: enabled && !!params.address,
    cacheTime: 60,
  })

  return {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}

// export const usePrimary = (address?: string, skip?: any) => {
//   return useQuery(
//     useQueryKeys().primary(address!),
//     async () => {
//       const res = await getName(address!)
//       if (!res || !res.name || !res.match) return null
//       return {
//         ...res,
//         name: res.name as string | undefined,
//         beautifiedName: tryBeautify(res.name),
//       }
//     },
//     {
//       enabled: ready && !skip && !!address,
//       cacheTime: 60,
//     },
//   )
// }
