import { useNetwork } from 'wagmi'

export const useChainId = () => {
  const { chain } = useNetwork()
  if (chain) {
    return chain.id ?? null
  }
  return 1
}
