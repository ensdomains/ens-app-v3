import { beautify } from '@ensdomains/ensjs/utils/normalise'

export const tryBeautify = (name: string): string => {
  try {
    return beautify(name)
  } catch (e) {
    return name
  }
}
