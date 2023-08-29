import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { GetDecodedNameParameters, getDecodedName } from '@ensdomains/ensjs/subgraph'
import { checkIsDecrypted } from '@ensdomains/ensjs/utils'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseDecodedNameParameters = Partial<GetDecodedNameParameters> & {
  enabled?: boolean
}

export const useDecodedName = ({ enabled = true, ...params }: UseDecodedNameParameters) => {
  const publicClient = usePublicClient()

  const nameIsEncrypted = useMemo(
    () => (params.name ? !checkIsDecrypted(params.name) : false),
    [params.name],
  )

  const { data, status, isFetched, isFetchedAfterMount, ...rest } = useQuery(
    useQueryKeys().getDecodedName(params as GetDecodedNameParameters),
    ({ queryKey: [params] }) => getDecodedName(publicClient, params),
    {
      enabled: enabled && nameIsEncrypted && !!params.name,
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
