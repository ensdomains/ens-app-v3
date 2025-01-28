import { randomBytes } from 'crypto'

export const generateCsrfToken = () => {
  return randomBytes(32).toString('hex')
}

export const validateCsrfToken = (cookieToken: string | undefined, headerToken: string | undefined) => {
  if (!cookieToken || !headerToken) {
    return false
  }
  return cookieToken === headerToken
}
