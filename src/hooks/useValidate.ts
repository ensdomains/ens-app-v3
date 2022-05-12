import {
  parseInputType,
  validateName,
} from '@ensdomains/ensjs/dist/cjs/utils/validation'
import { useEffect, useState } from 'react'

export const useValidate = (input: string, skip?: any) => {
  const _name =
    input && (input.split('.').length === 1 ? `${input}.eth` : input)

  const [name, setNormalisedName] = useState('')
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const [type, setType] = useState<any>(undefined)

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
  }, [_name, skip])

  return { valid, type, name }
}
