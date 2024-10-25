import { describe, expect, it } from 'vitest'

import { getLegacyFavorites, simplifyLegacyFavorites } from '@app/pages/legacyfavourites'

describe('getLegacyFavorites', () => {
  it('should return an empty array if no favorites are present', () => {
    const favorites = getLegacyFavorites()
    expect(favorites).toEqual('{}')
  })
  it('should return an array of favourites if favourites are present', () => {
    globalThis.localStorage.setItem(
      'ensFavourites',
      JSON.stringify([{ name: 'test', expiryTime: '123' }]),
    )
    const favorites = getLegacyFavorites()
    expect(favorites).toEqual(JSON.stringify([{ name: 'test', expiryTime: '123' }]))
  })
})

describe('simplifyLegacyFavorites', () => {
  it('should return an empty array if no favorites are present', () => {
    const favorites = simplifyLegacyFavorites([])
    expect(favorites).toEqual([])
  })
  it('should return an array of favorites if favorites are present', () => {
    const favorites = simplifyLegacyFavorites([{ name: 'test', expiryTime: '123' }])
    expect(favorites).toEqual([{ name: 'test', expiry: new Date('123') }])
  })
})
