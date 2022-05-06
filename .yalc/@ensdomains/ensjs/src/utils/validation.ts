import { normalize } from '@ensdomains/eth-ens-namehash'
import { isAddress } from 'ethers/lib/utils'
import { isEncodedLabelhash, saveName } from './labels'

export const validateName = (name: string) => {
  const nameArray = name.split('.')
  const hasEmptyLabels = nameArray.some((label) => label.length == 0)
  if (hasEmptyLabels) throw new Error('Name cannot have empty labels')
  const normalizedArray = nameArray.map((label) => {
    if (label === '[root]') {
      return label
    } else {
      return isEncodedLabelhash(label) ? label : normalize(label)
    }
  })
  const normalizedName = normalizedArray.join('.')
  saveName(normalizedName)
  return normalizedName
}

export const validateTLD = (name: string) => {
  const labels = name.split('.')
  return validateName(labels[labels.length - 1])
}

type InputType = {
  type: 'name' | 'label' | 'address' | 'unknown'
  info?: 'short' | 'supported' | 'unsupported'
}

export const parseInputType = (input: string): InputType => {
  const validTLD = validateTLD(input)
  let regex = /[^.]+$/

  try {
    validateName(input)
  } catch (e) {
    return {
      type: 'unknown',
    }
  }

  if (input.indexOf('.') !== -1) {
    const termArray = input.split('.')
    const tld = input.match(regex) ? input.match(regex)![0] : ''
    if (validTLD) {
      if (tld === 'eth' && [...termArray[termArray.length - 2]].length < 3) {
        // code-point length
        return {
          type: 'name',
          info: 'short',
        }
      }
      return {
        type: 'name',
        info: 'supported',
      }
    }

    return {
      type: 'name',
      info: 'unsupported',
    }
  } else if (isAddress(input)) {
    return {
      type: 'address',
    }
  } else {
    return {
      type: 'label',
    }
  }
}
