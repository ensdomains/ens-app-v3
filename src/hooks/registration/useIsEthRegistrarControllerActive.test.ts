import { mockFunction, renderHook } from '@app/test-utils'

import type { Address } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useReadContract } from 'wagmi'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'

import { useIsEthRegistrarControllerActive } from './useIsEthRegistrarControllerActive'

vi.mock('wagmi')
vi.mock('@app/hooks/chain/useContractAddress')

const mockUseReadContract = mockFunction(useReadContract)
const mockUseContractAddress = mockFunction(useContractAddress)

const BASE_REGISTRAR = '0x000000000000000000000000000000000000baa1' as Address
const ETH_REGISTRAR_CONTROLLER = '0x000000000000000000000000000000000000c0c0' as Address
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address

describe('useIsEthRegistrarControllerActive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseContractAddress.mockImplementation(
      (({ contract }: { contract: string }) => {
        if (contract === 'ensBaseRegistrarImplementation') return BASE_REGISTRAR
        if (contract === 'ensEthRegistrarController') return ETH_REGISTRAR_CONTROLLER
        return ZERO_ADDRESS
      }) as typeof useContractAddress,
    )
    mockUseReadContract.mockReturnValue({ data: true, isLoading: false } as any)
  })

  it('reads `controllers(ethRegistrarController)` on the BaseRegistrarImplementation', () => {
    renderHook(() => useIsEthRegistrarControllerActive())

    expect(mockUseReadContract).toHaveBeenCalledTimes(1)
    const call = mockUseReadContract.mock.calls[0]?.[0]
    expect(call?.address).toBe(BASE_REGISTRAR)
    expect(call?.functionName).toBe('controllers')
    expect(call?.args).toEqual([ETH_REGISTRAR_CONTROLLER])
    expect(call?.query?.enabled).toBe(true)
  })

  it('returns data === true when the controller is still authorised', () => {
    mockUseReadContract.mockReturnValue({ data: true, isLoading: false } as any)
    const { result } = renderHook(() => useIsEthRegistrarControllerActive())
    expect(result.current.data).toBe(true)
  })

  it('returns data === false when the controller has been removed', () => {
    mockUseReadContract.mockReturnValue({ data: false, isLoading: false } as any)
    const { result } = renderHook(() => useIsEthRegistrarControllerActive())
    expect(result.current.data).toBe(false)
  })

  it('disables the query when an address is missing', () => {
    mockUseContractAddress.mockImplementation(
      (({ contract }: { contract: string }) => {
        if (contract === 'ensBaseRegistrarImplementation') return BASE_REGISTRAR
        // ensEthRegistrarController missing -> falsy address
        return '' as unknown as Address
      }) as typeof useContractAddress,
    )

    renderHook(() => useIsEthRegistrarControllerActive())

    const call = mockUseReadContract.mock.calls[0]?.[0]
    expect(call?.query?.enabled).toBe(false)
  })
})
