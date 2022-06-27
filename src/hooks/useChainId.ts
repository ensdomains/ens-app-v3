import { useNetwork } from 'wagmi'

export const useChainId = () => {
  const { activeChain } = useNetwork()
  if (activeChain) {
    return activeChain.id ?? null
  }
  return 1
}
