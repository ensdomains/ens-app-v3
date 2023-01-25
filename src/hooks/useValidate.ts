import { isAddress } from '@ethersproject/address'
import { useEffect, useMemo, useState } from 'react'

import {
  checkIsDecrypted,
  checkLabel,
  isEncodedLabelhash,
  saveName,
} from '@ensdomains/ensjs/utils/labels'
import { parseInputType, validateName } from '@ensdomains/ensjs/utils/validation'

export const useValidate = (input: string, skip?: any) => {
  const { normalisedName, valid, type } = useMemo(() => {
    let _normalisedName = ''
    let _inputType: ReturnType<typeof parseInputType> | undefined
    let _valid: boolean | undefined
    if (!skip) {
      try {
        let decodedInput = decodeURIComponent(input)
        if (!checkIsDecrypted(decodedInput))
          decodedInput = decodedInput
            .split('.')
            .map((label) => (isEncodedLabelhash(label) ? checkLabel(label) || label : label))
            .join('.')
        _normalisedName = validateName(decodedInput)
        _inputType = parseInputType(_normalisedName)
        _valid = _inputType.type !== 'unknown' && _inputType.info !== 'unsupported'
        if (_valid) {
          saveName(_normalisedName)
        }
        // eslint-disable-next-line no-empty
      } catch {
        _valid = false
      }
    }
    return { normalisedName: _normalisedName, valid: _valid, type: _inputType }
  }, [input, skip])

  return { valid, type, name: normalisedName, labelCount: normalisedName.split('.').length }
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
