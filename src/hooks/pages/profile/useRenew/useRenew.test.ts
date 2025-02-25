import type { ParsedUrlQuery } from 'querystring'
import { mockFunction, renderHook, screen } from '@app/test-utils'

import { useConnectModal } from '@getpara/rainbowkit'
import mockRouter from 'next-router-mock'
import { useSearchParams } from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount, type UseAccountReturnType } from 'wagmi'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useBasicName } from '@app/hooks/useBasicName'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import type { RegistrationStatus } from '@app/utils/registrationStatus'

import { calculateRenewState, removeRenewParam, useRenew } from './useRenew'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/abilities/useAbilities')
vi.mock('wagmi')
vi.mock('@app/transaction-flow/TransactionFlowProvider')
vi.mock('next/navigation')

const mockUseBasicName = mockFunction(useBasicName)
const mockUseAbilities = mockFunction(useAbilities)
const mockUseAccount = mockFunction(useAccount)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)
const mockUseSearchParams = mockFunction(useSearchParams)

describe('calculateRenewState', () => {
  it('should return connect-user if accountStatus is disconnected', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'gracePeriod',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'disconnected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('connect-user')
  })

  it('should return display-extend-names if accountStatus is connected', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('display-extend-names')
  })

  it('should return idle if registration status is available', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'available',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if registration status is loading', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: true,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if renewSeconds is null', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: null,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if connectModalOpen is true', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: true,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if abilities is loading', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: true,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if isRouterReady is false', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: false,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if name is empty', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: '',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if openedConnectModal is true', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: true,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return idle if openConnectModal is undefined and accountStatus is disconnected', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'disconnected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: undefined,
      }),
    ).toBe('idle')
  })

  it('should return idle if registration status is neither registered nor gracePeriod', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'premium',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return display-extend-names when all conditions are met for connected user', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('display-extend-names')
  })

  it('should return idle when isRenewActive is false due to missing renewSeconds', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: null,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('idle')
  })

  it('should return connect-user when user is disconnected and openConnectModal is available', () => {
    const openConnectModal = () => {}
    expect(
      calculateRenewState({
        registrationStatus: 'registered',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'disconnected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal,
      }),
    ).toBe('connect-user')
  })

  it('should return display-extend-names when name is in grace period and user is connected', () => {
    expect(
      calculateRenewState({
        registrationStatus: 'gracePeriod',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'connected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal: () => {},
      }),
    ).toBe('display-extend-names')
  })

  it('should return connect-user when name is in grace period but user is disconnected', () => {
    const openConnectModal = () => {}
    expect(
      calculateRenewState({
        registrationStatus: 'gracePeriod',
        isRegistrationStatusLoading: false,
        renewSeconds: 123,
        connectModalOpen: false,
        accountStatus: 'disconnected' as UseAccountReturnType['status'],
        isAbilitiesLoading: false,
        isRouterReady: true,
        name: 'name',
        openedConnectModal: false,
        openConnectModal,
      }),
    ).toBe('connect-user')
  })

  describe('registration status tests', () => {
    const baseProps = {
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected' as UseAccountReturnType['status'],
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {},
    }

    const testCases: {
      status: RegistrationStatus
      expected: 'idle' | 'display-extend-names' | 'connect-user'
    }[] = [
      { status: 'invalid', expected: 'idle' },
      { status: 'short', expected: 'idle' },
      { status: 'imported', expected: 'idle' },
      { status: 'owned', expected: 'idle' },
      { status: 'notImported', expected: 'idle' },
      { status: 'notOwned', expected: 'idle' },
      { status: 'unsupportedTLD', expected: 'idle' },
      { status: 'offChain', expected: 'idle' },
    ]

    testCases.forEach(({ status, expected }) => {
      it(`should return ${expected} for registration status ${status}`, () => {
        expect(
          calculateRenewState({
            ...baseProps,
            registrationStatus: status,
          }),
        ).toBe(expected)
      })
    })
  })
})

describe('removeRenewParam', () => {
  it('should remove both name and renew params while preserving others', () => {
    // URL: ?name=test.eth&renew=123&other=value -> ?other=value
    expect(
      removeRenewParam({
        query: {
          name: 'test.eth',
          renew: '123',
          other: 'value',
        } as ParsedUrlQuery,
      }),
    ).toBe('?other=value')
  })

  it('should handle multiple values for other params', () => {
    // URL: ?name=test.eth&other=value1&other=value2&renew=123 -> ?other=value1&other=value2
    expect(
      removeRenewParam({
        query: {
          name: 'test.eth',
          other: ['value1', 'value2'],
          renew: '123',
        } as ParsedUrlQuery,
      }),
    ).toBe('?other=value1%2Cvalue2')
  })

  it('should preserve order of remaining params', () => {
    // URL: ?z=last&name=test.eth&a=first&renew=123&m=middle -> ?z=last&a=first&m=middle
    expect(
      removeRenewParam({
        query: {
          z: 'last',
          name: 'test.eth',
          a: 'first',
          renew: '123',
          m: 'middle',
        } as ParsedUrlQuery,
      }),
    ).toBe('?z=last&a=first&m=middle')
  })

  it('should handle encoded characters in params', () => {
    // URL: ?name=test%20name.eth&param=special%20value&renew=123 -> ?param=special%20value
    expect(
      removeRenewParam({
        query: {
          name: 'test name.eth',
          param: 'special value',
          renew: '123',
        } as ParsedUrlQuery,
      }),
    ).toBe('?param=special+value')
  })

  it('should return empty string when all params are removed', () => {
    // URL: ?name=test.eth&renew=123 -> ''
    expect(
      removeRenewParam({
        query: {
          name: 'test.eth',
          renew: '123',
        } as ParsedUrlQuery,
      }),
    ).toBe('')
  })

  it('should handle empty query object', () => {
    // URL: '' -> ''
    expect(
      removeRenewParam({
        query: {} as ParsedUrlQuery,
      }),
    ).toBe('')
  })

  it('should handle query with only name param', () => {
    // URL: ?name=test.eth -> ''
    expect(
      removeRenewParam({
        query: {
          name: 'test.eth',
        } as ParsedUrlQuery,
      }),
    ).toBe('')
  })

  it('should handle query with only renew param', () => {
    // URL: ?renew=123 -> ''
    expect(
      removeRenewParam({
        query: {
          renew: '123',
        } as ParsedUrlQuery,
      }),
    ).toBe('')
  })

  it('should preserve empty values in other params', () => {
    // URL: ?name=test.eth&empty=&renew=123 -> ?empty=
    expect(
      removeRenewParam({
        query: {
          name: 'test.eth',
          empty: '',
          renew: '123',
        } as ParsedUrlQuery,
      }),
    ).toBe('?empty=')
  })
})

describe('useRenew', () => {
  const mockShowExtendNamesInput = vi.fn()

  beforeEach(() => {
    mockUseBasicName.mockReturnValue({
      registrationStatus: 'registered',
      isLoading: false,
    })

    mockUseAbilities.mockReturnValue({
      data: { canSelfExtend: true },
      isLoading: false,
    })

    mockUseAccount.mockReturnValue({
      status: 'connected',
    })

    mockUseTransactionFlow.mockReturnValue({
      usePreparedDataInput: () => mockShowExtendNamesInput,
    })

    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'renew' ? '123' : null),
    })

    mockRouter.setCurrentUrl('/test.eth')
  })

  afterEach(() => {
    vi.clearAllMocks()
    mockRouter.setCurrentUrl('/')
  })

  it('should handle URL changes', () => {
    mockRouter.push('/test.eth?renew=86400')

    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'renew' ? '86400' : null),
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).toHaveBeenCalledWith('extend-names-test.eth', {
      names: ['test.eth'],
      isSelf: true,
      seconds: 86400,
    })

    mockRouter.push('/test.eth?renew=94608000')

    mockUseAbilities.mockReturnValue({
      data: { canSelfExtend: true },
      isLoading: false,
    })

    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'renew' ? '94608000' : null),
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).toHaveBeenCalledWith('extend-names-test.eth', {
      names: ['test.eth'],
      isSelf: true,
      seconds: 94608000,
    })
  })

  it('should show extend names input for registered names', () => {
    mockRouter.push('/test.eth?renew=123')

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).toHaveBeenCalledWith('extend-names-test.eth', {
      names: ['test.eth'],
      isSelf: true,
      seconds: 86400,
    })
    expect(mockRouter.asPath).toBe('/test.eth')
  })

  it('should show extend names input for registered names with default duration', () => {
    mockRouter.push('/test.eth?renew')

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).toHaveBeenCalledWith('extend-names-test.eth', {
      names: ['test.eth'],
      isSelf: true,
      seconds: 86400,
    })
    expect(mockRouter.asPath).toBe('/test.eth')
  })

  it('should show extend names input for registered names with large duration', () => {
    const largeDuration = 31536000000 // very large number
    mockRouter.push(`/test.eth?renew=${largeDuration}`)
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'renew' ? largeDuration.toString() : null),
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).toHaveBeenCalledWith('extend-names-test.eth', {
      names: ['test.eth'],
      isSelf: true,
      seconds: largeDuration,
    })
    expect(mockRouter.asPath).toBe('/test.eth')
  })

  it('should show extend names input for names in grace period', () => {
    mockRouter.push('/test.eth?renew=123')
    mockUseBasicName.mockReturnValue({
      registrationStatus: 'gracePeriod',
      isLoading: false,
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).toHaveBeenCalledWith('extend-names-test.eth', {
      names: ['test.eth'],
      isSelf: true,
      seconds: 86400,
    })
  })

  it('should open connect modal for disconnected users', () => {
    mockRouter.push('/test.eth?renew=123')
    const mockOpenConnectModal = vi.fn()
    mockUseAccount.mockReturnValue({ status: 'disconnected' })

    renderHook(() => useRenew('test.eth'))

    expect(useConnectModal().openConnectModal).toHaveBeenCalled()
    expect(mockShowExtendNamesInput).not.toHaveBeenCalled()
  })

  it('should do nothing when name is not registered or in grace period', () => {
    mockRouter.push('/test.eth?renew=123')
    mockUseBasicName.mockReturnValue({
      registrationStatus: 'available',
      isLoading: false,
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).not.toHaveBeenCalled()
  })

  it('should do nothing when registration status is loading', () => {
    mockRouter.push('/test.eth?renew=123')
    mockUseBasicName.mockReturnValue({
      registrationStatus: 'registered',
      isLoading: true,
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).not.toHaveBeenCalled()
  })

  it('should handle non-self-extendable names', () => {
    mockRouter.push('/test.eth?renew=123')
    mockUseAbilities.mockReturnValue({
      data: { canSelfExtend: false },
      isLoading: false,
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).toHaveBeenCalledWith('extend-names-test.eth', {
      names: ['test.eth'],
      isSelf: false,
      seconds: 86400,
    })
  })

  it('should do nothing when abilities are loading', () => {
    mockRouter.push('/test.eth?renew=123')
    mockUseAbilities.mockReturnValue({
      data: { canSelfExtend: true },
      isLoading: true,
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).not.toHaveBeenCalled()
  })

  it('should do nothing when router is not ready', () => {
    mockRouter.push('/test.eth?renew=123')
    mockRouter.isReady = false

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).not.toHaveBeenCalled()
  })

  it('should do nothing when connect modal is open', () => {
    mockRouter.push('/test.eth?renew=123')
    useConnectModal().connectModalOpen = true
    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).not.toHaveBeenCalled()
  })

  it('should handle invalid duration in URL', () => {
    mockRouter.push('/test.eth?renew=invalid')
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'renew' ? 'invalid' : null),
    })

    renderHook(() => useRenew('test.eth'))

    expect(mockShowExtendNamesInput).not.toHaveBeenCalled()
  })
})
