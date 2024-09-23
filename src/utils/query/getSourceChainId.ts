import { getSupportedChainById, type SourceChain, type TargetChain } from '@app/constants/chains'

export const getSourceChainId = (targetChainId: TargetChain['id']): SourceChain['id'] => {
  const chain = getSupportedChainById(targetChainId)!
  return (chain.sourceId ?? chain.id) as SourceChain['id']
}
