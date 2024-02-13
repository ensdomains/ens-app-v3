import { renderHook } from '@app/test-utils'

import useRoles from './useRoles'

const mockGetRoles = jest.fn().mockReturnValue([
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
jest.mock('./utils/getRoles', () => ({
  getRoles: () => mockGetRoles(),
}))

jest.mock('@app/hooks/useNameType', () => ({
  useNameType: () => ({
    isLoading: false,
  }),
}))

jest.mock('@app/hooks/useNameDetails', () => ({
  useNameDetails: () => ({
    isLoading: false,
  }),
}))

const mockUseParentBasicName = jest.fn().mockReturnValue({
  isLoading: false,
})
jest.mock('@app/hooks/useParentBasicName', () => ({
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
