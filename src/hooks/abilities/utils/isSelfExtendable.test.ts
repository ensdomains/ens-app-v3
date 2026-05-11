import { describe, expect, it } from 'vitest'

import { isNameOwnerOrManager, isSelfExtendable } from './isSelfExtendable'

describe('isSelfExtendable', () => {
  it('returns true for the registrant', () => {
    expect(
      isSelfExtendable({
        ownerData: {
          registrant: '0x1234567890123456789012345678901234567890',
        } as any,
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).toBe(true)
  })

  it('does not treat an unwrapped manager as self-extendable', () => {
    expect(
      isSelfExtendable({
        ownerData: {
          owner: '0x1234567890123456789012345678901234567890',
        } as any,
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).toBe(false)
  })
})

describe('isNameOwnerOrManager', () => {
  it('returns true for ownerData owner with different address casing', () => {
    expect(
      isNameOwnerOrManager({
        ownerData: {
          owner: '0x1234567890123456789012345678901234567890',
        } as any,
        address: '0x1234567890123456789012345678901234567890'.toUpperCase() as any,
      }),
    ).toBe(true)
  })
})
