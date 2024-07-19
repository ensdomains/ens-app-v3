import { describe, it, expect} from 'vitest'
import { createGetVerificationProps } from './createGetVerificationProps';
import { UseVerifiedRecordsReturnType } from '../useVerifiedRecords';
import { normaliseProfileAccountsRecord } from '@app/utils/records/normaliseProfileAccountsRecord';

describe('createGetVerificationProps', () => {
  it.each([
    ['com.twitter', '@testETH'],
    ['twitter', '@testeth'],
    ['twitter', 'testETH']
  ])('should return isVerfied is true for key = %s and value = %s', (key, value) => {
    const verifiedRecords: UseVerifiedRecordsReturnType = [{
      isVerified: true,
      isNameVerified: true,
      isAddressVerified: true,
      verifier: 'dentity',
      verifiedRecords: {
        'com.twitter': '@testETH'
      }
    }]
    const getVerificationProps = createGetVerificationProps(verifiedRecords)
    const normalisedRecord = normaliseProfileAccountsRecord({key, value})

    expect(getVerificationProps(normalisedRecord)).toEqual({ ...normalisedRecord, isVerified: true, verifiers: ['dentity']})
  })
})