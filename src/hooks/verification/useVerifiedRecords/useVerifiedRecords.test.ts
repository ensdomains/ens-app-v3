import { describe, expect, it } from 'vitest'

import { getVerifiedRecords, parseVerificationRecord } from './useVerifiedRecords'

describe('parseVerificationRecord', () => {
  it('should return empty array if undefined', () => {
    expect(parseVerificationRecord()).toEqual([])
  })

  it('should return empty array if malformed json', () => {
    expect(parseVerificationRecord('[aasdfassdafasd]')).toEqual([])
  })

  it('should return empty array if json is object', () => {
    expect(parseVerificationRecord('{"0":"test"}')).toEqual([])
  })

  it('should return empty array of strings if json is array of strings', () => {
    expect(parseVerificationRecord('["1", "2", "3"]')).toEqual(['1', '2', '3'])
  })
})

describe('getVerifiedRecords', () => {
  it('should return empty array when no verification providers are configured', async () => {
    const result = await getVerifiedRecords({
      queryKey: [
        { verificationsRecord: JSON.stringify(['https://example.com/verify']) },
        '0x123',
      ],
    } as any)
    expect(result).toEqual([])
  })
})
