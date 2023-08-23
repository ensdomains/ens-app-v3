import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { usePublicClient } from '../usePublicClient'

type UseContractAddressParameters = Omit<Parameters<typeof getChainContractAddress>['0'], 'client'>

export const useContractAddress = (params: UseContractAddressParameters) => {
  const publicClient = usePublicClient()
  
  return getChainContractAddress({ client: publicClient, ...params })
}
