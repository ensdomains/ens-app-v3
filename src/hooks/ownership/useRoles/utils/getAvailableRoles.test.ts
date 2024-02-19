import { describe, expect, it } from 'vitest'

import { getAvailableRoles } from './getAvailableRoles'

describe('getAvailableRoles', () => {
  it('should return a list of available roles', () => {
    expect(
      getAvailableRoles({
        roles: [
          { address: '0x123', role: 'owner' },
          { address: '0x456', role: 'manager' },
          { address: '0x123', role: 'eth-record' },
        ],
        abilities: {
          canSendOwner: true,
          canSendManager: true,
          canEditRecords: true,
        } as any,
      }),
    ).toEqual([
      { address: '0x123', role: 'owner' },
      { address: '0x456', role: 'manager' },
      { address: '0x123', role: 'eth-record' },
    ])
  })

  it('should return a list of available roles if roles are in grouped format', () => {
    expect(
      getAvailableRoles({
        roles: [{ address: '0x123', roles: ['owner', 'manager', 'eth-record'] }],
        abilities: {
          canSendOwner: true,
          canSendManager: true,
          canEditRecords: true,
        } as any,
      }),
    ).toEqual([
      { address: '0x123', role: 'owner' },
      { address: '0x123', role: 'manager' },
      { address: '0x123', role: 'eth-record' },
    ])
  })

  it('should return a empty list if abilities are empty', () => {
    expect(
      getAvailableRoles({
        roles: [
          { address: '0x123', role: 'owner' },
          { address: '0x456', role: 'manager' },
          { address: '0x123', role: 'eth-record' },
        ],
        abilities: {} as any,
      }),
    ).toEqual([])
  })
})
