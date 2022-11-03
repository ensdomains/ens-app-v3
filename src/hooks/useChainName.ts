import { useNetwork } from '@web3modal/react'

export const useChainName = () => {
  const { network } = useNetwork()
  if (network) {
    return network?.chain?.name.toLowerCase() ?? null
  }
  return 'mainnet'
}
