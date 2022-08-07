import { useState } from 'react'
import { ContractInterface } from '@app/validators/validateContract'
import { useQuery } from 'react-query'
import { useProvider, useNetwork } from 'wagmi'
import validateResolver from '../validators/validateResolver'
import { errorToString } from '../utils/errorToString'

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

  const provider = useProvider()
  const { activeChain } = useNetwork()
  const [errors, setErrors] = useState<string[]>([])

  const isEnabled = !!activeChain && !skip && !!resolverAddress

  const {
    data: hasInterface,
    isLoading,
    status,
    error,
  } = useQuery(
    ['validateResolver', resolverAddress, interfaceNames.join(','), activeChain?.id],
    async () => {
      const results = await validateResolver(interfaceNames, resolverAddress!, provider, {
        networkId: activeChain!.id,
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

  return {
    hasInterface,
    isLoading,
    status,
    errors: combinedErrors.length > 0 ? combinedErrors : undefined,
  }
}
