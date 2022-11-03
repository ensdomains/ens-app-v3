import { useNetwork } from '@web3modal/react'

export const useChainId = (): number => {
  const { network } = useNetwork()
  if (network) {
    return network?.chain?.id ?? 1
  }
  return 1
}
