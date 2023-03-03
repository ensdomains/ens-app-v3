import { useNetwork } from 'wagmi'

export const useChainName = () => {
  const { chain } = useNetwork()
  if (chain) {
    if (!chain.network) throw new Error('Chain network is not defined')
    const name = chain.network.toLowerCase()
    return name === 'homestead' ? 'mainnet' : name
  }
  return 'goerli'
}
