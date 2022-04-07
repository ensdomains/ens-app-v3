import { useEns } from '@app/utils/EnsProvider'
import { parseSearchTerm, validateName } from '@app/utils/utils'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export const useGetDomainFromInput = (input: string, skip?: any) => {
  const _name =
    input && (input.split('.').length === 1 ? `${input}.eth` : input)

  const [name, setNormalisedName] = useState('')
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const [type, setType] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)

  const { ready, getProfile } = useEns()

  const { data: profile } = useQuery(`profile-${name}`, () => getProfile(name))

  useEffect(() => {
    let normalisedName
    if (!skip) {
      try {
        setLoading(true)
        if (
          ready &&
          typeof _name === 'string' &&
          _name.length >= 3 &&
          !_name.split('.').some((label) => label.length === 0)
        ) {
          try {
            // This is under the assumption that validateName never returns false
            normalisedName = validateName(_name)
            setNormalisedName(normalisedName)
          } finally {
            parseSearchTerm(normalisedName || _name)
              .then((_type: any) => {
                if (
                  _type === 'supported' ||
                  _type === 'tld' ||
                  _type === 'search'
                ) {
                  setValid(true)

                  setType(_type)
                } else {
                  if (_type === 'invalid') {
                    setType('domainMalformed')
                  } else {
                    setType(_type)
                  }
                  setValid(false)
                }
              })
              .catch((err) => {
                console.error('Error parsing search:', err)
                setValid(false)
              })
          }
        } else {
          setValid(false)
        }
      } finally {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_name, ready])

  return { valid, type, profile, name, loading }
}
