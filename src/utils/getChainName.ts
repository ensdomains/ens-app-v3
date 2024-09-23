import { getSupportedChainById, type SupportedChain } from '@app/constants/chains'

export type ChainName = Lowercase<Exclude<SupportedChain['name'], 'Ethereum'>> | 'mainnet'

export const getChainName = (chainId: SupportedChain['id'] | undefined): ChainName => {
  if (chainId === 1 || !chainId) return 'mainnet'
  const chain = getSupportedChainById(chainId)!
  return chain.name.toLowerCase() as ChainName
}
