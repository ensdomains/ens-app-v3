import { describe, expect, it } from 'vitest'

import { normaliseProfileAccountsRecord } from '@app/utils/records/normaliseProfileAccountsRecord'

import { UseVerifiedRecordsReturnType } from '../useVerifiedRecords'
import { makeAppendVerificationProps } from './makeAppendVerificationProps'

const RECORD_ITEM_KEY_VALUES = [
  ['com.twitter', '@testETH'],
  ['twitter', '@testeth'],
  ['twitter', 'testETH'],
  ['com.x', 'testETH'],
  ['x', 'TESTETH'],
  ['telegram', 'testETH'],
  ['org.telegram', 'testETH'],
  ['com.discord', 'testETH'],
  ['discord', 'testETH'],
  ['com.github', 'testETH'],
  ['github', 'testETH'],
]

describe('makeAppendVerificationsProps', () => {
  it.each(RECORD_ITEM_KEY_VALUES)(
    'should return isVerified is true for key = %s and value = %s',
    (key, value) => {
      const verifiedRecords: UseVerifiedRecordsReturnType = [
        {
          issuer: 'dentity',
          key: 'com.twitter',
          value: '@testETH',
          verified: true,
        },
        {
          issuer: 'dentity',
          key: 'org.telegram',
          value: 'testETH',
          verified: true,
        },
        {
          issuer: 'dentity',
          key: 'com.discord',
          value: 'testETH',
          verified: true,
        },
        {
          issuer: 'dentity',
          key: 'com.github',
          value: 'testETH',
          verified: true,
        },
      ]
      const appendVerificationProps = makeAppendVerificationProps(verifiedRecords)
      const normalisedRecord = normaliseProfileAccountsRecord({ key, value })

      expect(appendVerificationProps(normalisedRecord)).toEqual({
        ...normalisedRecord,
        isVerified: true,
        verifiers: ['dentity'],
      })
    },
  )

  it.each(RECORD_ITEM_KEY_VALUES)(
    'should return isVerified is false for key = %s and value = %s if verified is false',
    (key, value) => {
      const verifiedRecords: UseVerifiedRecordsReturnType = [
        {
          issuer: 'dentity',
          key: 'com.twitter',
          value: '@testETH',
          verified: false,
        },
        {
          issuer: 'dentity',
          key: 'org.telegram',
          value: 'testETH',
          verified: false,
        },
        {
          issuer: 'dentity',
          key: 'com.discord',
          value: 'testETH',
          verified: false,
        },
        {
          issuer: 'dentity',
          key: 'com.github',
          value: 'testETH',
          verified: false,
        },
      ]
      const appendVerificationProps = makeAppendVerificationProps(verifiedRecords)
      const normalisedRecord = normaliseProfileAccountsRecord({ key, value })

      expect(appendVerificationProps(normalisedRecord)).toEqual({
        ...normalisedRecord,
        isVerified: false,
      })
    },
  )
})
