import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

export const useNamesFromResolvedAddress = (address?: string) => {
  const { ready, getNames } = useEns()

  const { data, isLoading } = useQuery(
    ['graph', 'resolvedAddressNames', address],
    () =>
      getNames({
        address: address!,
        type: 'resolvedAddress',
      }),
    {
      enabled: !!address && ready,
    },
  )

  return { names: data, isLoading }
}
