import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useChainName } from '@app/hooks/chain/useChainName'

import { useIsEthRegistrarControllerActive } from './useIsEthRegistrarControllerActive'
import { useIsLegacyFlowDisabled } from './useIsLegacyFlowDisabled'

vi.mock('@app/hooks/chain/useChainName')
vi.mock('./useIsEthRegistrarControllerActive')

const mockUseChainName = mockFunction(useChainName)
const mockUseIsEthRegistrarControllerActive = mockFunction(useIsEthRegistrarControllerActive)

describe('useIsLegacyFlowDisabled', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('is always disabled on mainnet and points at app.ens.domains', () => {
    mockUseChainName.mockReturnValue('mainnet')
    mockUseIsEthRegistrarControllerActive.mockReturnValue({ data: true, isLoading: false } as any)
    const { result } = renderHook(() => useIsLegacyFlowDisabled())
    expect(result.current).toEqual({
      isDisabled: true,
      isLoading: false,
      isMainnet: true,
      managerBaseUrl: 'https://app.ens.domains',
    })
  })

  it('does not wait for the controller check on mainnet', () => {
    mockUseChainName.mockReturnValue('mainnet')
    mockUseIsEthRegistrarControllerActive.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any)
    const { result } = renderHook(() => useIsLegacyFlowDisabled())
    expect(result.current.isDisabled).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('is disabled on other chains only once the controller has been removed', () => {
    mockUseChainName.mockReturnValue('sepolia')
    mockUseIsEthRegistrarControllerActive.mockReturnValue({ data: false, isLoading: false } as any)
    const { result } = renderHook(() => useIsLegacyFlowDisabled())
    expect(result.current).toEqual({
      isDisabled: true,
      isLoading: false,
      isMainnet: false,
      managerBaseUrl: 'https://sepolia.app.ens.domains',
    })
  })

  it('is enabled on other chains while the controller is active or loading', () => {
    mockUseChainName.mockReturnValue('sepolia')
    mockUseIsEthRegistrarControllerActive.mockReturnValue({ data: true, isLoading: false } as any)
    expect(renderHook(() => useIsLegacyFlowDisabled()).result.current.isDisabled).toBe(false)

    mockUseIsEthRegistrarControllerActive.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any)
    const { result } = renderHook(() => useIsLegacyFlowDisabled())
    expect(result.current.isDisabled).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })
})
