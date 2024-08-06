import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

export const recordKeyForVerificationProtocol = (protocol: VerificationProtocol) => {
  if (protocol === 'dentity') return 'com.dentity'
  throw new Error(`Unknown verification protocol: ${protocol}`)
}
