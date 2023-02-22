import { isAddress } from '@ethersproject/address'
import { useEffect, useState } from 'react'
import { useQuery } from 'wagmi'

import {
  checkIsDecrypted,
  checkLabel,
  isEncodedLabelhash,
  saveName,
} from '@ensdomains/ensjs/utils/labels'
import { parseInputType, validateName } from '@ensdomains/ensjs/utils/validation'

const validate = (input: string) => {
  let normalisedName = ''
  let inputType: ReturnType<typeof parseInputType> | undefined
  let valid: boolean | undefined
  try {
    let decodedInput = decodeURIComponent(input)
    if (!checkIsDecrypted(decodedInput))
      decodedInput = decodedInput
        .split('.')
        .map((label) => (isEncodedLabelhash(label) ? checkLabel(label) || label : label))
        .join('.')
    normalisedName = validateName(decodedInput)
    inputType = parseInputType(normalisedName)
    valid = inputType.type !== 'unknown' && inputType.info !== 'unsupported'
    if (valid) {
      saveName(normalisedName)
    }
    // eslint-disable-next-line no-empty
  } catch {
    valid = false
  }
  return {
    name: normalisedName,
    valid,
    type: inputType,
    labelCount: normalisedName.split('.').length,
  }
}

export const useValidate = (input: string, skip?: any) => {
  const { data } = useQuery(['validate', input], () => validate(input), {
    enabled: !skip,
    initialData: () =>
      skip ? { valid: undefined, type: undefined, name: '', labelCount: 0 } : validate(input),
  })

  return data
}

export const useValidateOrAddress = (input: string, skip?: any) => {
  const [inputIsAddress, setIsAddress] = useState(false)
  const { valid, type, name, labelCount } = useValidate(input, skip)

  useEffect(() => {
    if (!skip) {
      if (isAddress(input)) {
        setIsAddress(true)
      } else {
        setIsAddress(false)
      }
    }
  }, [input, skip])

  if (inputIsAddress) {
    return { valid: true, type: 'address', output: input }
  }

  return { valid, type, output: name, labelCount }
}
