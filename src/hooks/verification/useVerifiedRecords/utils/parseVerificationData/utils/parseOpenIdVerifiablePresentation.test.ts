import { makeMockVerifiablePresentationData } from '@root/test/mock/makeMockVerifiablePresentationData'
import { match } from 'ts-pattern'
import { describe, expect, it, vi } from 'vitest'

import {
  isOpenIdVerifiablePresentation,
  parseOpenIdVerifiablePresentation,
} from './parseOpenIdVerifiablePresentation'

vi.mock('../../parseVerifiedCredential', () => ({
  parseVerifiableCredential: () => async (type: string) =>
    match(type)
      .with('error', () => null)
      .with('twitter', () => ({
        issuer: 'dentity',
        key: 'com.twitter',
        value: 'name',
        verified: true,
      }))
      .otherwise(() => null),
}))

describe('isOpenIdVerifiablePresentation', () => {
  it('should return true if data is OpenIdVerifiablePresentation', () => {
    expect(isOpenIdVerifiablePresentation(makeMockVerifiablePresentationData('openid'))).toBe(true)
  })

  it('should return false if data is not OpenIdVerifiablePresentation', () => {
    expect(isOpenIdVerifiablePresentation({})).toBe(false)
  })

  it('should return false if data is undefined', () => {
    expect(isOpenIdVerifiablePresentation(undefined)).toBe(false)
  })

  it('should return false if vp_token is not array of objects', () => {
    expect(
      isOpenIdVerifiablePresentation({ vp_token: { iamnot: 'not verifiable credential' } }),
    ).toBe(false)
  })

  it('should return false if vp_token is not array of objects', () => {
    expect(isOpenIdVerifiablePresentation({ vp_token: ['not verifiable credential'] })).toBe(false)
  })
})

describe('parseOpenIdVerifiablePresentation', () => {
  it('should return an array of verified credentials an exclude any null values', async () => {
    const result = await parseOpenIdVerifiablePresentation({ ownershipVerified: true })({
      vp_token: ['twitter', 'error', 'other'] as any,
    })
    expect(result).toEqual([
      { issuer: 'dentity', key: 'com.twitter', value: 'name', verified: true },
    ])
  })
})
