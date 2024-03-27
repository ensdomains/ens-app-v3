import { describe, expect, it } from 'vitest'


import { checkAvailablePrimaryName } from './checkAvailablePrimaryName'
import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

describe('checkAvailablePrimaryName', () => {

  it('should return true for offchain names with resolved address of user', () => {
    const address = '0x189fa72c8959aa18bea737d46c10826de4ef81a2'
    const ownerData = undefined as GetOwnerReturnType | undefined
    const profile = { address, isMigrated: undefined }
    const wrappedData = undefined as GetWrapperDataReturnType | undefined

    const result = checkAvailablePrimaryName('primary.eth', {
      isAuthorized: true
    } as any)({
      name: 'name.eth',
      relation: {
        owner: ownerData?.owner === address,
        registrant: ownerData?.registrant === address,
        resolvedAddress: profile?.address === address,
        wrappedOwner: wrappedData?.owner === address,
      },
      isMigrated: profile?.isMigrated !== false,
      expiryDate: undefined,
      fuses: null
    })
    expect(result).toBe(true)
  })
})