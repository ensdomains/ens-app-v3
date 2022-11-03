import { useQuery } from '@tanstack/react-query'
import { useNetwork, useProvider } from '@web3modal/react'
import { useState } from 'react'

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

  const { provider } = useProvider()
  const { network } = useNetwork()
  const [errors, setErrors] = useState<string[]>([])

  const isEnabled = !!network && !skip && !!resolverAddress

  const {
    data: hasInterface,
    isLoading,
    status,
    error,
  } = useQuery(
    ['validateResolver', resolverAddress, interfaceNames.join(','), network?.chain?.id],
    async () => {
      const results = await validateResolver(interfaceNames, resolverAddress!, provider, {
        networkId: network?.chain?.id,
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
