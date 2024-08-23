import { describe, expect, it } from 'vitest'

import { parseVerifiableCredential } from './parseVerifiedCredential'

describe('parseVerifiedCredential', () => {
  it('should parse x account verified credential', async () => {
    expect(
      await parseVerifiableCredential({
        type: ['VerifiedXAccount'],
        credentialSubject: { username: 'name' },
      } as any),
    ).toEqual({
      issuer: 'dentity',
      key: 'com.twitter',
      value: '@name',
      verified: true,
    })
  })

  it('should parse twitter account verified credential', async () => {
    expect(
      await parseVerifiableCredential({
        type: ['VerifiedTwitterAccount'],
        credentialSubject: { username: 'name' },
      } as any),
    ).toEqual({
      issuer: 'dentity',
      key: 'com.twitter',
      value: '@name',
      verified: true,
    })
  })

  it('should parse discord account verified credential', async () => {
    expect(
      await parseVerifiableCredential({
        type: ['VerifiedDiscordAccount'],
        credentialSubject: { name: 'name' },
      } as any),
    ).toEqual({
      issuer: 'dentity',
      key: 'com.discord',
      value: 'name',
      verified: true,
    })
  })

  it('should parse telegram account verified credential', async () => {
    expect(
      await parseVerifiableCredential({
        type: ['VerifiedTelegramAccount'],
        credentialSubject: { name: 'name' },
      } as any),
    ).toEqual({
      issuer: 'dentity',
      key: 'org.telegram',
      value: 'name',
      verified: true,
    })
  })

  it('should parse github account verified credential', async () => {
    expect(
      await parseVerifiableCredential({
        type: ['VerifiedGithubAccount'],
        credentialSubject: { name: 'name' },
      } as any),
    ).toEqual({
      issuer: 'dentity',
      key: 'com.github',
      value: 'name',
      verified: true,
    })
  })

  it('should parse personhood verified credential', async () => {
    expect(
      await parseVerifiableCredential({
        type: ['VerifiedPersonhood'],
        credentialSubject: { name: 'name' },
      } as any),
    ).toEqual({
      issuer: 'dentity',
      key: 'personhood',
      value: '',
      verified: true,
    })
  })

  it('should return null otherwise', async () => {
    expect(
      await parseVerifiableCredential({
        type: ['VerifiedIddentity'],
        credentialSubject: { name: 'name' },
      } as any),
    ).toEqual(null)
  })
})
