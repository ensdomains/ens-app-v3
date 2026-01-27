import { makeMockVerifiablePresentationData } from '@root/test/mock/makeMockVerifiablePresentationData'
import { match } from 'ts-pattern'
import { describe, expect, it, vi } from 'vitest'

import { DENTITY_BASE_ENDPOINT } from '@app/constants/verification'

import { getVerifiedRecords, parseVerificationRecord } from './useVerifiedRecords'

const mockUrl = (path: string) => `${DENTITY_BASE_ENDPOINT}/${path}`

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
  const mockFetch = vi.fn().mockImplementation(async (uri) =>
    match(uri)
      .with(mockUrl('error'), () => Promise.reject('error'))
      .otherwise(() =>
        Promise.resolve({
          json: () => Promise.resolve(makeMockVerifiablePresentationData('openid')),
        }),
      ),
  )
  vi.stubGlobal('fetch', mockFetch)

  it('should exclude fetches that error from results ', async () => {
    const result = await getVerifiedRecords({
      queryKey: [
        { verificationsRecord: JSON.stringify([mockUrl('error'), mockUrl('regular'), mockUrl('error')]) },
        '0x123',
      ],
    } as any)
    expect(result).toHaveLength(7)
  })

  it('should return a flat array of verified credentials', async () => {
    const result = await getVerifiedRecords({
      queryKey: [
        {
          verificationsRecord: JSON.stringify([
            mockUrl('one'),
            mockUrl('two'),
            mockUrl('error'),
            mockUrl('three'),
          ]),
        },
      ],
    } as any)
    expect(result).toHaveLength(21)
    expect(result.every((item) => !Array.isArray(item))).toBe(true)
  })
})
