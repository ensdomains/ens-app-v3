import { useEns } from '@app/utils/EnsProvider'
import {
  parseInputType,
  validateName,
} from '@ensdomains/ensjs/dist/cjs/utils/validation'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export const useGetDomainFromInput = (input: string, skip?: any) => {
  const _name =
    input && (input.split('.').length === 1 ? `${input}.eth` : input)

  const [name, setNormalisedName] = useState('')
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const [type, setType] = useState<any>(undefined)

  const { ready, getProfile } = useEns()

  const {
    data: profile,
    isLoading: loading,
    status,
  } = useQuery(['getProfile', name], () => getProfile(name), {
    enabled: ready && !skip && name !== '',
  })

  useEffect(() => {
    if (!skip) {
      try {
        const normalisedName = validateName(_name)
        setNormalisedName(normalisedName)

        const inputType = parseInputType(normalisedName)
        setType(inputType.type)
        setValid(
          inputType.type !== 'unknown' && inputType.info !== 'unsupported',
        )
      } catch {
        setValid(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_name, ready, skip])

  return { valid, type, profile, name, loading, status }
}
