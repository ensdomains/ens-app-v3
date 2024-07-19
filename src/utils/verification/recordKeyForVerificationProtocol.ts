import type { VerifivationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

export const recordKeyForVerificationProtocol = (protocol: VerifivationProtocol) => {
  if (protocol === 'dentity') return 'com.dentity'
  throw new Error(`Unknown verification protocol: ${protocol}`)
}
