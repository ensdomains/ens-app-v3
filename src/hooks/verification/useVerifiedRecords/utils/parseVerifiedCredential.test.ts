import { describe, expect, it } from 'vitest'

import { parseVerifiableCredential } from './parseVerifiedCredential'

describe('parseVerifiedCredential', () => {
  it('should return null when no verification providers are configured', async () => {
    expect(
      await parseVerifiableCredential({ ownershipVerified: true })({
        type: ['VerifiedTwitterAccount'],
        credentialSubject: { username: 'name' },
      } as any),
    ).toEqual(null)
  })

  it('should return null for any credential type', async () => {
    expect(
      await parseVerifiableCredential({ ownershipVerified: true })({
        type: ['VerifiedPersonhood'],
        credentialSubject: { name: 'name' },
      } as any),
    ).toEqual(null)
  })
})
