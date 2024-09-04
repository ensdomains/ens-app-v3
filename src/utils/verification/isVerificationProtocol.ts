import { VERIFICATION_PROTOCOLS } from '@app/constants/verification'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

export const isVerificationProtocol = (value: string): value is VerificationProtocol => {
  return VERIFICATION_PROTOCOLS.includes(value as VerificationProtocol)
}
