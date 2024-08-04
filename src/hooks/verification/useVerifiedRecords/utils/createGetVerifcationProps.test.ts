import { describe, expect, it } from 'vitest'

import { normaliseProfileAccountsRecord } from '@app/utils/records/normaliseProfileAccountsRecord'

import { UseVerifiedRecordsReturnType } from '../useVerifiedRecords'
import { createGetVerificationProps } from './createGetVerificationProps'

describe('createGetVerificationProps', () => {
  it.each([
    ['com.twitter', '@testETH'],
    ['twitter', '@testeth'],
    ['twitter', 'testETH'],
  ])('should return isVerfied is true for key = %s and value = %s', (key, value) => {
    const verifiedRecords: UseVerifiedRecordsReturnType = [
      {
        issuer: 'dentity',
        key: 'com.twitter',
        value: '@testETH',
        verified: true,
      },
    ]
    const getVerificationProps = createGetVerificationProps(verifiedRecords)
    const normalisedRecord = normaliseProfileAccountsRecord({ key, value })

    expect(getVerificationProps(normalisedRecord)).toEqual({
      ...normalisedRecord,
      isVerified: true,
      verifiers: ['dentity'],
    })
  })
})
