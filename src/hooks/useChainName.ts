import { useNetwork } from 'wagmi'

export const useChainName = () => {
  const { activeChain } = useNetwork()
  if (activeChain) {
    return activeChain.name ?? null
  }
  return 'mainnet'
}
