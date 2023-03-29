import { useMemo } from 'react'
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

  const formattedNames = useMemo(() => {
    if (!data) return []
    return data.map((name) => {
      const isWrapped = !!name.fuses
      return {
        ...name,
        isResolvedAddress: true,
        isController: !isWrapped && name.manager === address,
        isRegistrant: !isWrapped && name.owner === address,
        isWrappedOwner: isWrapped && name.owner === address,
      }
    })
  }, [data, address])

  return { names: formattedNames, isLoading }
}
