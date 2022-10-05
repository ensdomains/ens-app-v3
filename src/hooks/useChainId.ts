import { useNetwork } from '@web3modal/react'

export const useChainId = () => {
  const { chain } = useNetwork()
  if (chain) {
    return chain.id ?? null
  }
  return 1
}
