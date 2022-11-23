import { useNetwork } from 'wagmi'

export const useChainId = (): number => {
  const { chain } = useNetwork()
  if (chain) {
    return chain.id ?? null
  }
  return 5
}
