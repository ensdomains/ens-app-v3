import { describe, expect, it } from 'vitest'

import { profileHasRecords } from './profile'

describe('profileHasRecords', () => {
  it('should return true if a text record exists', () => {
    expect(
      profileHasRecords({
        texts: [{ key: 'test', value: 'test' }],
      }),
    ).toBe(true)
  })

  it('should return true if a coin record exists', () => {
    expect(
      profileHasRecords({
        coins: [{ id: 0, name: 'test', value: 'test' }],
      }),
    ).toBe(true)
  })

  it('should return true if a content hash object string exists', () => {
    expect(
      profileHasRecords({
        contentHash: { protocolType: 'ipfs', decoded: 'contentId' },
      }),
    ).toBe(true)
  })

  it('should return true if an abi record string exists', () => {
    expect(
      profileHasRecords({
        abi: { contentType: 1, abi: '[{}]', decoded: true },
      }),
    ).toBe(true)
  })

  it('should return false if profile is empty', () => {
    expect(profileHasRecords({})).toBe(false)
  })

  it('should return false if contentHash is empty', () => {
    expect(
      profileHasRecords({
        contentHash: {} as any,
      }),
    ).toBe(false)
  })
})
