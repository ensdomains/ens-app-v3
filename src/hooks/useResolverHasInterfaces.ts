import { useState } from 'react'
import { useNetwork, useProvider, useQuery } from 'wagmi'

import { useChainId } from '@app/hooks/useChainId'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { NAMESYS_RESOLVERS } from '@app/utils/constants'
import { ContractInterface } from '@app/validators/validateContract'

import { errorToString } from '../utils/errorToString'
import validateResolver from '../validators/validateResolver'

type Options = {
  fallbackMsg?: string
}

export const useResolverHasInterfaces = (
  interfaceNames: ContractInterface[],
  resolverAddress?: string,
  skip?: boolean,
  options?: Options,
) => {
  const fallbackMsg =
    options?.fallbackMsg || 'Cannot determine if address supports resolver methods'

  const chainId = useChainId()
  const provider = useProvider()
  const { chain } = useNetwork()
  const [errors, setErrors] = useState<string[]>([])

  const isEnabled = !!chain && !skip && !!resolverAddress
  const isNameSys = resolverAddress === NAMESYS_RESOLVERS[`${chainId}`][0]
  console.log(isNameSys)
  const {
    data: hasInterface,
    isLoading,
    status,
    error,
  } = useQuery(
    useQueryKeys().resolverHasInterfaces(interfaceNames.join(','), resolverAddress),
    async () => {
      const results = await validateResolver(interfaceNames, resolverAddress!, provider, {
        networkId: chain!.id,
      })
      if (results.length === 0) {
        setErrors([])
        return true
      }
      setErrors(results)
      return false
    },
    {
      enabled: isEnabled,
    },
  )

  const combinedErrors = [...errors, ...(error ? [errorToString(error, fallbackMsg)] : [])]
  const returnedErrors = isNameSys ? [fallbackMsg] : combinedErrors

  return {
    hasInterface,
    isLoading,
    status,
    errors: returnedErrors.length > 0 ? returnedErrors : undefined,
  }
}
