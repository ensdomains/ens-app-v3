import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

import { useContractAddress } from './useContractAddress'

const useWrapperApprovedForAll = (address: string, isSubdomain: boolean) => {
  const { contracts } = useEns()
  const nameWrapperAddress = useContractAddress('NameWrapper')
  const { data: approvedForAll, isLoading } = useQuery(
    ['approvedForAll', nameWrapperAddress, address],
    async () => {
      const registry = await contracts!.getRegistry()
      return registry.isApprovedForAll(address, nameWrapperAddress)
    },
    {
      enabled: !!address && !!nameWrapperAddress && isSubdomain,
    },
  )

  return { approvedForAll, isLoading }
}

export default useWrapperApprovedForAll
