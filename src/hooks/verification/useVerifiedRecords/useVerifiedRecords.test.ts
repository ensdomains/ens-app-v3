import { match } from 'ts-pattern';
import { getVerifiedRecords, parseVerificationRecord } from './useVerifiedRecords';
import { describe, it, vi, expect } from 'vitest';
import { makeMockVerifiablePresentationData } from '@root/test/mock/makeMockVerifiablePresentationData';

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
    expect(parseVerificationRecord('["1", "2", "3"]')).toEqual(["1", "2", "3"])
  })
})



describe.only('getVerifiedRecords', () => {
  const mockFetch = vi.fn().mockImplementation(async (uri) => match(uri).with('error', () => Promise.reject('error')).otherwise(() => Promise.resolve({ json: () => Promise.resolve(makeMockVerifiablePresentationData('openid'))})))
  vi.stubGlobal('fetch', mockFetch)
  
  it('should exclude fetches that error from results ', async () => {
    const result = await getVerifiedRecords({ queryKey: [{ verificationsRecord: '["error", "regular", "error"]'}, '0x123']} as any)
    expect(result).toHaveLength(6)
  })

  it('should return a flat array of verified credentials', async () => {
    const result = await getVerifiedRecords({ queryKey: [{ verificationsRecord: '["one", "two", "error", "three"]'}]} as any)
    expect(result).toHaveLength(18)
    expect(result.every((item) => !Array.isArray(item))).toBe(true)
  })
})