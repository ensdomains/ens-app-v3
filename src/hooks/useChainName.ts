import { useNetwork } from 'wagmi'

export const useChainName = () => {
  const { chain } = useNetwork()
  if (chain) {
    return chain.network.toLowerCase() ?? null
  }
  return 'mainnet'
}
