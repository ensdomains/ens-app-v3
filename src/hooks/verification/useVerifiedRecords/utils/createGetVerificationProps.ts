import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'
import { NormalisedAccountsRecord } from '@app/utils/records/normaliseProfileAccountsRecord'

import type { UseVerifiedRecordsReturnType } from '../useVerifiedRecords'

type BaseReturnType = { isVerified: boolean; verifiers?: VerificationProtocol[] | never }

type VerifiedReturnType = { isVerified: true; verifiers: VerificationProtocol[] }

type UnVerifiedReturnType = { isVerified: false; verifiers?: never }

type GenericReturnType<T extends RecordItem> = T & {
  isVerified: boolean
  verifiers?: VerificationProtocol[]
}

export type GetVerifiedRecordsPropsReturnType = BaseReturnType &
  (VerifiedReturnType | UnVerifiedReturnType)

type RecordItem = Record<'key' | 'value', string>

export const createGetVerificationProps =
  (verificationData?: UseVerifiedRecordsReturnType) =>
  <T extends NormalisedAccountsRecord>({
    value,
    normalisedKey,
    ...rest
  }: T): GenericReturnType<T> => {
    if (!verificationData) return { isVerified: false, value, normalisedKey, ...rest } as any
    const verifiers = verificationData
      .filter(({ verifiedRecords, isVerified }) => {
        return (
          isVerified && verifiedRecords?.[normalisedKey]?.toLowerCase() === value?.toLowerCase()
        )
      })
      .map(({ verifier }) => verifier)

    const isVerified = verifiers.length > 0
    if (isVerified) return { isVerified, verifiers, value, normalisedKey, ...rest } as any
    return {
      value,
      normalisedKey,
      ...rest,
      isVerified,
    } as any
  }
