import { MINIMUM_DOT_ETH_CHARS } from './consts'
import { checkLabel, isEncodedLabelhash, saveName } from './labels'
import { Label, normalise, split } from './normalise'

export const validateName = (name: string) => {
  const nameArray = name.split('.')
  const normalisedArray = nameArray.map((label) => {
    if (label.length === 0) throw new Error('Name cannot have empty labels')
    if (label === '[root]') {
      if (name !== label) throw new Error('Root label must be the only label')
      return label
    }
    return isEncodedLabelhash(label)
      ? checkLabel(label) || label
      : normalise(label)
  })
  const normalisedName = normalisedArray.join('.')
  saveName(normalisedName)
  return normalisedName
}

export type ParsedInputResult = {
  type: 'name' | 'label'
  normalised: string | undefined
  isValid: boolean
  isShort: boolean
  is2LD: boolean
  isETH: boolean
  labelDataArray: Label[]
}

export const parseInput = (input: string): ParsedInputResult => {
  let nameReference = input
  let isValid = false

  try {
    nameReference = validateName(input)
    isValid = true
  } catch {}

  const normalisedName = isValid ? nameReference : undefined

  const labels = nameReference.split('.')
  const tld = labels[labels.length - 1]
  const isETH = tld === 'eth'
  const labelDataArray = split(nameReference)
  const isShort =
    (labelDataArray[0].output?.length || 0) < MINIMUM_DOT_ETH_CHARS

  if (labels.length === 1) {
    return {
      type: 'label',
      normalised: normalisedName,
      isShort,
      isValid,
      is2LD: false,
      isETH,
      labelDataArray,
    }
  }

  const is2LD = labels.length === 2
  return {
    type: 'name',
    normalised: normalisedName,
    isShort: isETH && is2LD ? isShort : false,
    isValid,
    is2LD,
    isETH,
    labelDataArray,
  }
}

export const checkIsDotEth = (labels: string[]) =>
  labels.length === 2 && labels[1] === 'eth'
