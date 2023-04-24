import { Profile } from '@app/types'

import { profileHasRecords } from './profile'

describe('profileHasRecords', () => {
  it('should return true if a text record exists', () => {
    expect(
      profileHasRecords({
        records: { texts: [{ key: 'test', value: 'test', type: 'text' }] },
      } as Profile),
    ).toBe(true)
  })

  it('should return true if a coin record exists', () => {
    expect(
      profileHasRecords({
        records: { coinTypes: [{ coin: 'test', key: '', value: 'test', type: 'addr' }] },
      } as Profile),
    ).toBe(true)
  })

  it('should return true if a content hash record string exists', () => {
    expect(
      profileHasRecords({
        records: { contentHash: 'ipfs://contentId' },
      } as Profile),
    ).toBe(true)
  })

  it('should return true if a content hash object string exists', () => {
    expect(
      profileHasRecords({
        records: { contentHash: { protocolType: 'ipfs', decoded: 'contentId' } },
      } as Profile),
    ).toBe(true)
  })

  it('should return true if an abi record string exists', () => {
    expect(
      profileHasRecords({
        records: { abi: { contentType: 1, data: '[{}]' } },
      } as any),
    ).toBe(true)
  })

  it('should return false if profile is empty', () => {
    expect(profileHasRecords({} as any)).toBe(false)
  })

  it('should return false if records is empty', () => {
    expect(
      profileHasRecords({
        records: {},
      } as Profile),
    ).toBe(false)
  })

  it('should return false if contentHash is empty', () => {
    expect(
      profileHasRecords({
        records: { contentHash: {} },
      } as Profile),
    ).toBe(false)
  })

  it('should return false if contentHash is empty string', () => {
    expect(
      profileHasRecords({
        records: { contentHash: '' },
      } as Profile),
    ).toBe(false)
  })
})
