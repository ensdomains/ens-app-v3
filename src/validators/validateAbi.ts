import { TFunction } from 'i18next'

export const validateAbi = (t: TFunction) => (abi?: string) => {
  if (!abi) return true
  try {
    JSON.parse(abi)
    return true
  } catch (e) {
    console.error(e)
    return t('errors.invalidJSON', { ns: 'profile' })
  }
}
