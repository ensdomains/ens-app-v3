import { Config } from 'wagmi'

export const getChainName = (config: Config, { chainId }: { chainId: number }) => {
  if (chainId === 1 || !chainId) return 'mainnet'
  const chainName = config.getClient({ chainId }).chain.name
  return chainName.toLowerCase()
}
