import validateResolver from '@app/validators/validateResolver'

import { OWNED_PUBLIC_RESOLVERS, emptyAddress } from './constants'
import { canEditRecordsWhenWrappedCalc } from './utils'

export const isOwnedPublicResolver = (resolverAddress: string = '', chainId: number = 1) => {
  return !!OWNED_PUBLIC_RESOLVERS[chainId]?.find(({ address }) => address === resolverAddress)
}

type Error = 'noResolver' | 'invalidResolver' | 'ownedResolver' | 'notWrapperCompatible'

export const canResolverSetPrimaryName = async (
  resolverAddress: string,
  isWrapped: boolean,
  provider: any,
  chainId: number = 1,
): Promise<{ result: boolean; error?: Error }> => {
  if (!resolverAddress || resolverAddress === emptyAddress)
    return { result: false, error: 'noResolver' }
  const resolverErrors = await validateResolver(
    ['IAddrResolver', 'IAddressResolver'],
    resolverAddress,
    provider,
    {
      networkId: chainId,
    },
  )
  if (resolverErrors.length > 0) return { result: false, error: 'invalidResolver' }
  if (isOwnedPublicResolver(resolverAddress, chainId))
    return { result: false, error: 'ownedResolver' }

  const isWrapperAware = canEditRecordsWhenWrappedCalc(isWrapped, resolverAddress, chainId)
  if (!isWrapperAware) return { result: false, error: 'notWrapperCompatible' }

  return { result: true }
}
