import { VERIFICATION_PROTOCOLS } from '@app/constants/verification'
import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

const isVerificationProtocol = (value: string): value is VerificationProtocol =>
  VERIFICATION_PROTOCOLS.includes(value as VerificationProtocol)

export const parseVerificationRecord = (record?: string): [VerificationProtocol, string][] => {
  if (!record) return []
  const json = JSON.parse(record)
  if (
    Array.isArray(json) &&
    json.every(
      (item) =>
        Array.isArray(item) &&
        isVerificationProtocol(item[0]) &&
        !!item[1] &&
        typeof item[1] === 'string',
    )
  )
    return json
  throw new Error('Invalid verification record')
}
