import type { DecodedText } from '@ensdomains/ensjs/dist/types'

import {
  supportedGeneralRecordKeys,
  SupportedGeneralRecordsKey,
} from '@app/constants/supportedGeneralRecordKeys'
import {
  SupportedSimplexRecordKey,
  supportedSimplexRecordKeys,
} from '@app/constants/supportedSimplexRecordKeys'
import {
  SupportedSocialRecordKey,
  supportedSocialRecordKeys,
} from '@app/constants/supportedSocialRecordKeys'
import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

import { contentHashToString } from '../contenthash'
import {
  NormalisedAccountsRecord,
  normaliseProfileAccountsRecord,
} from './normaliseProfileAccountsRecord'

type WithIconKey = { iconKey: string }

export type ProfileAccountRecord = NormalisedAccountsRecord & {
  isVerified?: boolean
  verifiers?: VerificationProtocol[]
} & WithIconKey

export type ProfileOtherRecord = DecodedText & { type: 'text' | 'contenthash' } & WithIconKey

export const categoriseAndTransformTextRecords = ({
  texts = [],
  contentHash,
  appendVerificationProps,
}: {
  texts?: DecodedText[]
  contentHash?: any
  appendVerificationProps?: (
    record: NormalisedAccountsRecord,
  ) => NormalisedAccountsRecord & { isVerified?: boolean; verifiers?: VerificationProtocol[] }
}) => {
  const categorisedTextRecords = texts.reduce<{
    general: DecodedText[]
    simplex: ProfileAccountRecord[]
    accounts: ProfileAccountRecord[]
    other: ProfileOtherRecord[]
  }>(
    (acc, record) => {
      const normalisedRecord = normaliseProfileAccountsRecord(record)
      // SNRC: SimpleX links are their own category, above socials (issue #10).
      if (
        supportedSimplexRecordKeys.includes(
          normalisedRecord.normalisedKey as unknown as SupportedSimplexRecordKey,
        )
      ) {
        return {
          ...acc,
          simplex: [
            ...acc.simplex,
            {
              ...normalisedRecord,
              iconKey: normalisedRecord.normalisedKey,
            },
          ],
        }
      }
      if (
        supportedSocialRecordKeys.includes(
          normalisedRecord.normalisedKey as unknown as SupportedSocialRecordKey,
        )
      ) {
        const normalisedRecordWithVerifications =
          appendVerificationProps?.(normalisedRecord) || normalisedRecord
        return {
          ...acc,
          accounts: [
            ...acc.accounts,
            {
              ...normalisedRecordWithVerifications,
              iconKey: normalisedRecord.normalisedKey,
            },
          ],
        }
      }
      if (supportedGeneralRecordKeys.includes(record.key as unknown as SupportedGeneralRecordsKey))
        return {
          ...acc,
          general: [...acc.general, record],
        }
      if (record.key === VERIFICATION_RECORD_KEY) return acc
      return {
        ...acc,
        other: [...acc.other, { ...record, type: 'text', iconKey: record.key }],
      }
    },
    {
      general: [],
      simplex: [],
      accounts: [],
      other: [],
    },
  )

  const _contentHash = contentHashToString(contentHash)
  return {
    ...categorisedTextRecords,
    other: [
      ...categorisedTextRecords.other,
      ...(_contentHash
        ? [
            {
              key: 'contenthash',
              value: _contentHash,
              type: 'contenthash',
              iconKey: 'contenthash',
            } as ProfileOtherRecord,
          ]
        : []),
    ],
  }
}
