import { normalize } from 'viem/ens'

export const tryNormalize = (name: string): string | null => {
  try {
    return normalize(name)
  } catch {
    return null
  }
}

export const isValidEnsName = (name: string): boolean => {
  return tryNormalize(name) !== null
}
