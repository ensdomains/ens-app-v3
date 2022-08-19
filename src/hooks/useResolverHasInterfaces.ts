import { ContractInterface } from '@app/validators/validateContract'
import { useState } from 'react'
import { useNetwork, useProvider, useQuery } from 'wagmi'
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

  const provider = useProvider()
  const { chain } = useNetwork()
  const [errors, setErrors] = useState<string[]>([])

  const isEnabled = !!chain && !skip && !!resolverAddress

  const {
    data: hasInterface,
    isLoading,
    status,
    error,
  } = useQuery(
    ['validateResolver', resolverAddress, interfaceNames.join(','), chain?.id],
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

  return {
    hasInterface,
    isLoading,
    status,
    errors: combinedErrors.length > 0 ? combinedErrors : undefined,
  }
}
