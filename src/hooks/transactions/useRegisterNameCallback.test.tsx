import { mockFunction } from '@app/test-utils'

import { QueryClient } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import { WagmiConfig, createClient } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { Transaction } from './transactionStore'
import { useRegisterNameCallback } from './useRegisterNameCallback'

const makeTransaction = ({
  name,
  status = 'confirmed',
  action = 'registerName',
}: {
  name: string
  status?: Transaction['status']
  action?: Transaction['action']
}): Transaction => {
  const registerKey = `register-${name}-0x1234567890123456789012345678901234567890`
  return {
    action,
    status,
    key: registerKey,
    hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
  } as Transaction
}

jest.mock('@app/utils/cacheKeyFactory')
const mockQueryKey = jest.fn()
const mockUseQueryKeys = mockFunction(useQueryKeys)
mockUseQueryKeys.mockReturnValue({
  basicNameRoot: mockQueryKey,
})

const createWrapper = () => {
  const wagmiClient = createClient({
    queryClient: new QueryClient(),
    provider: {} as any,
  })
  return ({ children }: any) => <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}

describe('useRegisterNameCallback', () => {
  beforeEach(() => {
    mockQueryKey.mockReset()
  })

  it('should call queryKey with name if registerName transaction is complete', () => {
    const { result } = renderHook(() => useRegisterNameCallback(), {
      wrapper: createWrapper(),
    })
    result.current(
      makeTransaction({ name: 'test.eth', status: 'confirmed', action: 'registerName' }),
    )
    expect(mockQueryKey).toHaveBeenCalledWith('test.eth')
  })

  it('should call queryKey with correct name even if it has a lot of dashes ', () => {
    const { result } = renderHook(() => useRegisterNameCallback(), {
      wrapper: createWrapper(),
    })
    result.current(
      makeTransaction({
        name: '-test-test-test-test-.eth',
        status: 'confirmed',
        action: 'registerName',
      }),
    )
    expect(mockQueryKey).toHaveBeenCalledWith('-test-test-test-test-.eth')
  })

  it('should call not call queryKey if status or action are incorrect ', () => {
    const { result } = renderHook(() => useRegisterNameCallback(), {
      wrapper: createWrapper(),
    })
    result.current(
      makeTransaction({
        name: 'test.eth',
        status: 'pending',
        action: 'registerName',
      }),
    )
    result.current(makeTransaction({ name: 'test.eth', status: 'confirmed', action: 'commitName' }))
    expect(mockQueryKey).not.toHaveBeenCalled()
  })
})
