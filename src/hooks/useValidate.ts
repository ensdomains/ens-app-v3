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
  // Normalize to NFC to ensure consistent code point composition before parsing
  const nfcInput = typeof decodedInput.normalize === 'function' ? decodedInput.normalize('NFC') : decodedInput
  const { normalised: name, ...parsedInput } = parseInput(nfcInput)
  // Ignore Common/Inherited/ASCII buckets when determining script mixing
  const scriptOf = (t: unknown) => String(t || '')
  const relevantScripts = parsedInput.labelDataArray
    .map((d) => scriptOf((d as any).type))
    .filter((t) => t && t !== 'ASCII' && t !== 'Common' && t !== 'Inherited')
  const scriptSet = new Set(relevantScripts)
  const hasMixedScripts = scriptSet.size > 1
  const isLatinOnly = scriptSet.size <= 1 && (scriptSet.size === 0 || scriptSet.has('Latin'))
  const isNonASCII = parsedInput.labelDataArray.some((dataItem) => scriptOf((dataItem as any).type) !== 'ASCII')
  // Consider either explicit emoji metadata or presence of extended pictographic chars
  const emojiRegex = /\p{Extended_Pictographic}/u
  const hasEmoji = parsedInput.labelDataArray.some((d) => Boolean((d as any).emoji)) || emojiRegex.test(nfcInput)
  const outputName = name || nfcInput

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
