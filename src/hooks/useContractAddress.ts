import { ContractName } from '@ensdomains/ensjs/contracts/types'

import { useEns } from '@app/utils/EnsProvider'

import { useChainId } from './useChainId'

export const useContractAddress = (contractName: ContractName) => {
  const chainId = useChainId()
  const { getContractAddress } = useEns()
  return getContractAddress(chainId as any)(contractName)
}
