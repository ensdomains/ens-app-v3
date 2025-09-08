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
    hasEmoji?: boolean
    hasMixedScripts?: boolean
    isLatinOnly?: boolean
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
  const scriptTypes = new Set(parsedInput.labelDataArray.map((d) => d.type).filter((t) => t))
  const hasMixedScripts = scriptTypes.size > 1
  const isLatinOnly = scriptTypes.size === 1 && scriptTypes.has('Latin')
  const hasEmoji = parsedInput.labelDataArray.some((d) => Boolean((d as any).emoji))
  const outputName = name || input

  return {
    ...parsedInput,
    name: outputName,
    beautifiedName: tryBeautify(outputName),
    isNonASCII,
    labelCount: parsedInput.labelDataArray.length,
    hasEmoji,
    hasMixedScripts,
    isLatinOnly,
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
  hasEmoji: undefined as boolean | undefined,
  hasMixedScripts: undefined as boolean | undefined,
  isLatinOnly: undefined as boolean | undefined,
})

type UseValidateParameters = {
  input: string
  enabled?: boolean
}

const tryValidate = (input: string) => {
  if (!input) return defaultData
  try {
    return validate(input)
  } catch {
    return defaultData
  }
}

const map = new Map()

export const useValidate = ({ input }: UseValidateParameters): ValidationResult => {
  const mapValue = map.get(input)
  if (mapValue) return mapValue

  const value = tryValidate(input)
  map.set(input, value)
  return value
}
