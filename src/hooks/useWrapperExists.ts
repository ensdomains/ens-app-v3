import { useEns } from '@app/utils/EnsProvider'
import { emptyAddress } from '@app/utils/utils'
import { useChainId } from './useChainId'

export const useWrapperExists = () => {
  const { ready, getContractAddress } = useEns()
  const chainId = useChainId()
  const nameWrapperAddress = getContractAddress(String(chainId) as any)(
    'NameWrapper',
  )
  return ready && nameWrapperAddress && nameWrapperAddress !== emptyAddress
}
