import { useNetwork } from '@web3modal/react'

export const useChainName = () => {
  const { chain } = useNetwork()
  if (chain) {
    return chain.network.toLowerCase() ?? null
  }
  return 'mainnet'
}
