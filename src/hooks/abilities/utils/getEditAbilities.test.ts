import { describe, expect, it } from 'vitest'

import { getEditAbilities } from './getEditAbilities'

describe('getEditAbilities', () => {
  it('should return all true except for canEditPermissions if user is owner of unwrapped name', () => {
    const basicNameData: any = {
      ownerData: {
        ownershipLevel: 'registry',
        owner: '0x123',
      },
    }
    const result = getEditAbilities({
      address: '0x123',
      basicNameData,
      hasAuthorisedResolver: true,
    })

    expect(result).toMatchObject({
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: false,
      canCreateSubdomains: true,
      canEditTTL: true,
    })
  })

  it('should return all true if user is owner of wrapped name', () => {
    const basicNameData: any = {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: '0x123',
      },
      wrapperData: {
        fuses: {
          child: {},
        },
      },
    }
    const result = getEditAbilities({
      address: '0x123',
      basicNameData,
      hasAuthorisedResolver: true,
    })

    expect(result).toMatchObject({
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: true,
      canCreateSubdomains: true,
      canEditTTL: true,
    })
  })

  it('should return canEditRecords is false if hasAuthorisedResolver is false for wrapped name owner', () => {
    const basicNameData: any = {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: '0x123',
      },
      wrapperData: {
        fuses: {
          child: {},
        },
      },
    }
    const result = getEditAbilities({
      address: '0x123',
      basicNameData,
      hasAuthorisedResolver: false,
    })

    expect(result).toMatchObject({
      canEdit: true,
      canEditRecords: false,
      canEditResolver: true,
      canEditPermissions: true,
      canCreateSubdomains: true,
      canEditTTL: true,
    })
  })

  it('should return canEditRecords is false if hasAuthorisedResolver is false for unwrapped name owner', () => {
    const basicNameData: any = {
      ownerData: {
        ownershipLevel: 'registrar',
        owner: '0x123',
      },
      wrapperData: {
        fuses: {
          child: {},
        },
      },
    }
    const result = getEditAbilities({
      address: '0x123',
      basicNameData,
      hasAuthorisedResolver: false,
    })

    expect(result).toMatchObject({
      canEdit: true,
      canEditRecords: false,
      canEditResolver: true,
      canEditPermissions: false,
      canCreateSubdomains: true,
      canEditTTL: true,
    })
  })

  it('should return all canEdit is true and false for other abilities if permission has been burned', () => {
    const basicNameData: any = {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: '0x123',
      },
      wrapperData: {
        fuses: {
          child: {
            CANNOT_CREATE_SUBDOMAIN: true,
            CANNOT_SET_RESOLVER: true,
            CANNOT_SET_TTL: true,
            CANNOT_BURN_FUSES: true,
          },
        },
      },
    }
    const result = getEditAbilities({
      address: '0x123',
      basicNameData,
      hasAuthorisedResolver: false,
    })

    expect(result).toMatchObject({
      canEdit: true,
      canEditRecords: false,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
    })
  })

  it('should return all canEdit is true and canEditRecords is true if all permission has been burned if isAuthorizedResolver is true', () => {
    const basicNameData: any = {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: '0x123',
      },
      wrapperData: {
        fuses: {
          child: {
            CANNOT_CREATE_SUBDOMAIN: true,
            CANNOT_SET_RESOLVER: true,
            CANNOT_SET_TTL: true,
            CANNOT_BURN_FUSES: true,
          },
        },
      },
    }
    const result = getEditAbilities({
      address: '0x123',
      basicNameData,
      hasAuthorisedResolver: true,
    })

    expect(result).toMatchObject({
      canEdit: true,
      canEditRecords: true,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
    })
  })
})
