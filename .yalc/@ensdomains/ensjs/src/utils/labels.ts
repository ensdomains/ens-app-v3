import { labelhash, type Hex } from 'viem'
import {
  InvalidEncodedLabelError,
  InvalidLabelhashError,
} from '../errors/utils.js'

const hasLocalStorage = typeof localStorage !== 'undefined'

export function decodeLabelhash(hash: string): Hex {
  if (!(hash.startsWith('[') && hash.endsWith(']')))
    throw new InvalidEncodedLabelError({
      label: hash,
      details:
        'Expected encoded labelhash to start and end with square brackets',
    })

  if (hash.length !== 66)
    throw new InvalidEncodedLabelError({
      label: hash,
      details: 'Expected encoded labelhash to have a length of 66',
    })

  return `0x${hash.slice(1, -1)}`
}

export function encodeLabelhash(hash: string) {
  if (!hash.startsWith('0x'))
    throw new InvalidLabelhashError({
      labelhash: hash,
      details: 'Expected labelhash to start with 0x',
    })

  if (hash.length !== 66)
    throw new InvalidLabelhashError({
      labelhash: hash,
      details: 'Expected labelhash to have a length of 66',
    })

  return `[${hash.slice(2)}]`
}

export function isEncodedLabelhash(hash: string) {
  return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66
}

function getLabels() {
  return hasLocalStorage
    ? JSON.parse(localStorage.getItem('ensjs:labels') as string) || {}
    : {}
}

function _saveLabel(hash: string, label: any) {
  if (!hasLocalStorage) return hash
  const labels = getLabels()
  localStorage.setItem(
    'ensjs:labels',
    JSON.stringify({
      ...labels,
      [hash]: label,
    }),
  )
  return hash
}

export function saveLabel(label: string) {
  const hash = `${labelhash(label.toLowerCase())}`
  return _saveLabel(hash, label)
}

export function saveName(name: string) {
  const nameArray = name.split('.')
  for (const label of nameArray) {
    if (!isEncodedLabelhash(label)) {
      saveLabel(label)
    }
  }
}

export function checkLabel(hash: string): string {
  const labels = getLabels()
  if (isEncodedLabelhash(hash)) {
    return labels[decodeLabelhash(hash)] || hash
  }
  return hash
}

export function checkIsDecrypted(string: string | string[]) {
  return !string?.includes('[')
}

export function decryptName(name: string) {
  return name
    .split('.')
    .map((label: any) => checkLabel(label))
    .join('.')
}
