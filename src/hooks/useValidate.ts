import { useMemo } from 'react'

import { ParsedInputResult, parseInput } from '@ensdomains/ensjs/utils'

import { Prettify } from '@app/types'
import { tryBeautify } from '@app/utils/beautify'

export type ValidationResult = Prettify<
  Partial<Omit<ParsedInputResult, 'normalised' | 'labelDataArray'>> & {
    name: string
    beautifiedName: string
    isNonASCII: boolean | undefined
    labelCount: number
    labelDataArray: ParsedInputResult['labelDataArray']
  }
>

const tryDecodeURIComponent = (input: string) => {
  try {
    return decodeURIComponent(input)
  } catch {
    return input
  }
}

export const validate = (input: string) => {
  const decodedInput = tryDecodeURIComponent(input)
  const { normalised: name, ...parsedInput } = parseInput(decodedInput)
  const isNonASCII = parsedInput.labelDataArray.some((dataItem) => dataItem.type !== 'ASCII')
  const outputName = name || input

  return {
    ...parsedInput,
    name: outputName,
    beautifiedName: tryBeautify(outputName),
    isNonASCII,
    labelCount: parsedInput.labelDataArray.length,
  }
}

const defaultData = Object.freeze({
  name: '',
  beautifiedName: '',
  isNonASCII: undefined,
  labelCount: 0,
  type: undefined,
  isValid: undefined,
  isShort: undefined,
  is2LD: undefined,
  isETH: undefined,
  labelDataArray: [],
})

type UseValidateParameters = {
  input: string
}

const tryValidate = (input: string) => {
  if (!input) return defaultData
  try {
    return validate(input)
  } catch {
    return defaultData
  }
}

export const useValidate = ({ input }: UseValidateParameters): ValidationResult => {
  const validationResult = useMemo(() => tryValidate(input), [input])
  return validationResult
}
