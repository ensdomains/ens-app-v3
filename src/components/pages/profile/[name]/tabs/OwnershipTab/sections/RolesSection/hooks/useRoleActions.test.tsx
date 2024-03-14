import { renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useRoleActions } from './useRoleActions'

const mockUseNameType = vi.fn()
vi.mock('@app/hooks/nameType/useNameType', () => ({
  useNameType: () => ({ ...mockUseNameType(), isLoading: false }),
}))

const mockUseAbilites = vi.fn()
vi.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: () => ({
    ...mockUseAbilites(),
    isLoading: false,
  }),
}))

vi.mock('@app/hooks/account/useAccountSafely', () => ({
  useAccountSafely: () => ({ address: '0xaccount' }),
}))

const mockCheckCanSend = vi.fn()
vi.mock('@app/transaction-flow/input/SendName/utils/checkCanSend', () => ({
  checkCanSend: () => mockCheckCanSend(),
}))

const mockCheckCanSyncManager = vi.fn()
vi.mock('@app/transaction-flow/input/SyncManager/utils/checkCanSyncManager', () => ({
  checkCanSyncManager: () => mockCheckCanSyncManager(),
}))

const mockGetAvailableRoles = vi.fn().mockReturnValue([])
vi.mock('@app/hooks/ownership/useRoles/utils/getAvailableRoles', () => ({
  getAvailableRoles: () => mockGetAvailableRoles(),
}))

describe('useRoleActions', () => {
  it('should include the ability to send eth name if checkCanSend return true', async () => {
    mockCheckCanSend.mockReturnValueOnce(true)
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.eth',
        roles: [],
        details: {
          ownerData: {
            owner: '0xowner',
            ownershipLevel: 'registrar',
          },
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'send-name' })]),
    )
    expect(result.current.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'send-dns' })]),
    )
  })

  it('should include the ability to send dns name if checkCanSend returns true', async () => {
    mockCheckCanSend.mockReturnValueOnce(true)
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.com',
        roles: [],
        details: {
          ownerData: {
            owner: '0xowner',
            ownershipLevel: 'registrar',
          },
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'send-dns' })]),
    )
    expect(result.current.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'send-name' })]),
    )
  })

  it('should not include the ability to send dns or eth name if checkCanSend returns false', async () => {
    mockCheckCanSend.mockReturnValueOnce(false)
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.com',
        roles: [],
        details: {
          ownerData: {
            owner: '0xowner',
            ownershipLevel: 'registrar',
          },
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'send-dns' })]),
    )
    expect(result.current.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'send-name' })]),
    )
  })

  it('should include the ability to refresh dns name if user is logged in and name is not .eth', async () => {
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.com',
        roles: [],
        details: {
          ownerData: {
            owner: '0xowner',
            ownershipLevel: 'registrar',
          },
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'refresh-dns' })]),
    )
  })

  it('should not include the ability to refresh dns name if user is logged in and name is .eth', async () => {
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.eth',
        roles: [],
        details: {
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'refresh-dns' })]),
    )
  })

  it('should include the ability to sync manager if checkCanSyncManager returns true', async () => {
    mockCheckCanSyncManager.mockReturnValueOnce(true)
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.com',
        roles: [],
        details: {
          ownerData: {
            owner: '0xowner',
            ownershipLevel: 'registrar',
          },
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'sync-manager' })]),
    )
  })

  it('should not include the ability to sync manager checkCanSyncManager returns false', async () => {
    mockCheckCanSyncManager.mockReturnValueOnce(false)
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.com',
        roles: [],
        details: {
          ownerData: {
            owner: '0xowner',
            ownershipLevel: 'registrar',
          },
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'sync-manager' })]),
    )
  })

  it('should include the ability to edit roles if getAvailableRoles returns at least one result', async () => {
    mockGetAvailableRoles.mockReturnValueOnce([{ role: 'manager', address: '0xmanager' }])
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.com',
        roles: [],
        details: {
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'edit-roles' })]),
    )
  })

  it('should not include the ability to edit roles if getAvailableRoles returns at zero result', async () => {
    mockGetAvailableRoles.mockReturnValueOnce([])
    const { result } = renderHook(() =>
      useRoleActions({
        name: 'test.com',
        roles: [],
        details: {
          isLoading: false,
        } as any,
      }),
    )
    expect(result.current.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'edit-roles' })]),
    )
  })
})
