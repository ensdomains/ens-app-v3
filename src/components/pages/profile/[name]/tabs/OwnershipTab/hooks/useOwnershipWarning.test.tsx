import { renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useOwnershipWarning } from './useOwnershipWarning'

vi.mock('@app/hooks/account/useAccountSafely', () => ({
  useAccountSafely: () => ({
    address: '0x1234',
  }),
}))

vi.mock('@app/hooks/useParentBasicName', () => ({
  useParentBasicName: () => ({
    isLoading: false,
    ownerData: {
      owner: '0x456',
    },
  }),
}))

describe('useOwnershipWarning', () => {
  it('should return a warning if user is owner not manager of 2ld eth name ', async () => {
    const { result } = renderHook(() =>
      useOwnershipWarning({
        name: 'test.eth',
        nameType: {
          data: 'eth-unwrapped-2ld',
          isLoading: false,
        } as any,
        details: {
          isLoading: false,
          ownerData: {
            registrant: '0x1234',
            owner: '0x456',
          },
          dnsOwner: '0x1234',
        } as any,
      }),
    )
    expect(result.current.data).toEqual('tabs.ownership.warning.ownerNotManager')
  })

  it('should return a warning if user is dns owner not manager of 2ld dns name ', async () => {
    const { result } = renderHook(() =>
      useOwnershipWarning({
        name: 'test.com',
        nameType: {
          data: 'dns-unwrapped-2ld',
          isLoading: false,
        } as any,
        details: {
          isLoading: false,
          ownerData: {
            owner: '0x456',
          },
          dnsOwner: '0x1234',
        } as any,
      }),
    )
    expect(result.current.data).toEqual('tabs.ownership.warning.dnsOwnerNotManager')
  })

  it('should return a warning if user is manager not dns owner of 2ld dns name ', async () => {
    const { result } = renderHook(() =>
      useOwnershipWarning({
        name: 'test.com',
        nameType: {
          data: 'dns-unwrapped-2ld',
          isLoading: false,
        } as any,
        details: {
          isLoading: false,
          ownerData: {
            owner: '0x1234',
          },
          dnsOwner: '0x456',
        } as any,
      }),
    )
    expect(result.current.data).toEqual('tabs.ownership.warning.managerNotDNSOwner')
  })

  it('should return a warning if user is manager not dns owner of 2ld dns name ', async () => {
    const { result } = renderHook(() =>
      useOwnershipWarning({
        name: 'test.com',
        nameType: {
          data: 'dns-unwrapped-2ld',
          isLoading: false,
        } as any,
        details: {
          isLoading: false,
          ownerData: {
            owner: '0x1234',
          },
          dnsOwner: '0x456',
        } as any,
      }),
    )
    expect(result.current.data).toEqual('tabs.ownership.warning.managerNotDNSOwner')
  })

  it('should return a warning if user is manager not owner of unwrapped subname ', async () => {
    const { result } = renderHook(() =>
      useOwnershipWarning({
        name: 'test.com',
        nameType: {
          data: 'dns-unwrapped-subname',
          isLoading: false,
        } as any,
        details: {
          isLoading: false,
          ownerData: {
            owner: '0x1234',
          },
          dnsOwner: '',
        } as any,
      }),
    )
    expect(result.current.data).not.toBeUndefined()
  })

  it('should return undefined if user is not owner or manager of subname ', async () => {
    const { result } = renderHook(() =>
      useOwnershipWarning({
        name: 'test.com',
        nameType: {
          data: 'dns-unwrapped-subname',
          isLoading: false,
        } as any,
        details: {
          isLoading: false,
          ownerData: {
            owner: '0x456',
          },
          dnsOwner: '',
        } as any,
      }),
    )
    expect(result.current.data).toBeUndefined()
  })
})
