import { describe, expect, it } from 'vitest'

import { nameLevel, parentName } from './name'

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
