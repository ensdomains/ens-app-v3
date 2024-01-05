import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

export const useNamesFromResolvedAddress = (address?: string) => {
  const { ready, getNames } = useEns()

  return useQuery(
    useQueryKeys().namesFromResolvedAddress(address),
    async () => {
      const names = await getNames({
        address: address!,
        type: 'resolvedAddress',
      })
      return names.map((name) => {
        const isWrapped = !!name.fuses
        return {
          ...name,
          isResolvedAddress: true,
          isController: !isWrapped && name.manager === address,
          isRegistrant: !isWrapped && name.owner === address,
          isWrappedOwner: isWrapped && name.owner === address,
        }
      })
    },
    {
      enabled: !!address && ready,
    },
  )
}
