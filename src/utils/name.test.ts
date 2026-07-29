import { describe, expect, it } from 'vitest'

import { createDateAndValue } from '@app/utils/utils'

import { isStaleLegacyRegistryName, nameLevel, parentName } from './name'

describe('nameLevel', () => {
  it('should return correct value for a subname ', () => {
    expect(nameLevel('subname.test.eth')).toEqual('subname')
  })

  it('should return correct value for a 2ld ', () => {
    expect(nameLevel('test.eth')).toEqual('2ld')
  })

  it('should return correct value for a tld', () => {
    expect(nameLevel('eth')).toEqual('tld')
  })

  it('should return the correct value for [root]', () => {
    expect(nameLevel('[root]')).toEqual('root')
  })
})

describe('isStaleLegacyRegistryName', () => {
  it('should return true for a .eth 2LD with no expiry', () => {
    expect(isStaleLegacyRegistryName({ parentName: 'eth', expiryDate: null })).toBe(true)
  })

  it('should return false for a .eth 2LD with an expiry', () => {
    expect(
      isStaleLegacyRegistryName({
        parentName: 'eth',
        expiryDate: createDateAndValue(new Date('2020-01-01').getTime()),
      }),
    ).toBe(false)
  })

  it('should return false for a subname with no expiry', () => {
    expect(isStaleLegacyRegistryName({ parentName: 'test.eth', expiryDate: null })).toBe(false)
  })

  it('should return false for a DNS 2LD with no expiry', () => {
    expect(isStaleLegacyRegistryName({ parentName: 'com', expiryDate: null })).toBe(false)
  })
})

describe('parentName', () => {
  it('should return a 2ld name for a subname', () => {
    expect(parentName('subname.test.eth')).toEqual('test.eth')
  })

  it('should return a tld for a 2ld name', () => {
    expect(parentName('test.eth')).toEqual('eth')
  })

  it('should return a root for a tld', () => {
    expect(parentName('eth')).toEqual('[root]')
  })
})
