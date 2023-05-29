import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useContractAddress } from './useContractAddress'

const useWrapperApprovedForAll = (address: string, isSubdomain: boolean, canBeWrapped: boolean) => {
  const { contracts } = useEns()
  const nameWrapperAddress = useContractAddress('NameWrapper')
  const { data: approvedForAll, isLoading } = useQuery(
    useQueryKeys().wrapperApprovedForAll(address),
    async () => {
      const registry = await contracts!.getRegistry()
      return registry.isApprovedForAll(address, nameWrapperAddress)
    },
    {
      enabled: !!address && !!nameWrapperAddress && isSubdomain && canBeWrapped,
    },
  )

  return { approvedForAll, isLoading }
}

export default useWrapperApprovedForAll
