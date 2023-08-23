import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { GetDecodedNameParameters, getDecodedName } from '@ensdomains/ensjs/subgraph'
import { usePublicClient } from '../../usePublicClient'

type UseDecodedNameParameters = GetDecodedNameParameters & {
  enabled?: boolean
}

export const useDecodedName = ({
  enabled = true,
  ...params
}: UseDecodedNameParameters) => {
  const publicClient = usePublicClient()

  const nameIsEncrypted = useMemo(() => !checkIsDecrypted(params.name), [params.name])

  const {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    ...rest
  } = useQuery(
    useQueryKeys().getDecodedName(params),
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
