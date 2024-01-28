import type { NameType } from '../types.js'

export const getNameType = (name: string): NameType => {
  const labels = name.split('.')
  const isDotEth = labels[labels.length - 1] === 'eth'

  if (labels.length === 0) return 'root'
  if (labels.length === 1) {
    if (isDotEth) return 'eth-tld'
    return 'tld'
  }
  if (labels.length === 2) {
    if (isDotEth) return 'eth-2ld'
    return 'other-2ld'
  }
  if (isDotEth) return 'eth-subname'
  return 'other-subname'
}
