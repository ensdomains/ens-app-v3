import { renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import useRoles from './useRoles'

const mockGetRoles = vi.fn().mockReturnValue([
  {
    address: '0x123',
    role: 'owner',
  },
  {
    address: '0x456',
    role: 'manager',
  },
  {
    address: '0x123',
    role: 'eth-record',
  },
])
vi.mock('./utils/getRoles', () => ({
  getRoles: () => mockGetRoles(),
}))

vi.mock('@app/hooks/nameType/useNameType', () => ({
  useNameType: () => ({
    isLoading: false,
  }),
}))

vi.mock('@app/hooks/useNameDetails', () => ({
  useNameDetails: () => ({
    isLoading: false,
  }),
}))

const mockUseParentBasicName = vi.fn().mockReturnValue({
  isLoading: false,
})
vi.mock('@app/hooks/useParentBasicName', () => ({
  useParentBasicName: () => mockUseParentBasicName(),
}))

describe('useRoles', () => {
  it('should return an empty array if no roles are passed', () => {
    const { result } = renderHook(() => useRoles('test.eth'))
    expect(mockGetRoles).toHaveBeenCalled()
    expect(result.current.data).toEqual([
      { address: '0x123', role: 'owner' },
      { address: '0x456', role: 'manager' },
      { address: '0x123', role: 'eth-record' },
    ])
  })

  it('should return a list of grouped roles if grouped is true', () => {
    const { result } = renderHook(() => useRoles('test.eth', { grouped: true }))
    expect(mockGetRoles).toHaveBeenCalled()
    expect(result.current.data).toEqual([
      {
        address: '0x123',
        roles: ['owner', 'eth-record'],
      },
      {
        address: '0x456',
        roles: ['manager'],
      },
    ])
  })
})

it('should grouped falsy address together', () => {
  mockGetRoles.mockReturnValueOnce([
    {
      address: '',
      role: 'owner',
    },
    {
      address: undefined,
      role: 'manager',
    },
    {
      address: false,
      role: 'eth-record',
    },
  ])
  const { result } = renderHook(() => useRoles('test.eth', { grouped: true }))
  expect(mockGetRoles).toHaveBeenCalled()
  expect(result.current.data).toEqual([
    {
      address: null,
      roles: ['owner', 'manager', 'eth-record'],
    },
  ])
})
