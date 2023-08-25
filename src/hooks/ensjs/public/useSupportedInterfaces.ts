import { Hex } from 'viem'
import { useQuery } from 'wagmi'

import { GetSupportedInterfacesParameters, getSupportedInterfaces } from '@ensdomains/ensjs/public'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseSupportedInterfacesParameters<TInterfaces extends readonly Hex[]> =
  GetSupportedInterfacesParameters<TInterfaces> & {
    enabled?: boolean
  }

export const useSupportedInterfaces = <
  TInterfaces extends readonly Hex[],
  TParams extends UseSupportedInterfacesParameters<TInterfaces> = UseSupportedInterfacesParameters<TInterfaces>,
>({
  enabled = true,
  ...params
}: TParams) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(
    queryKeys.getSupportedInterfaces(params),
    ({ queryKey: [params] }) => getSupportedInterfaces(publicClient, params),
    {
      enabled: enabled && !!params.address && params.interfaces.length > 0,
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
