import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConnectorClient, useEstimateGas } from 'wagmi'

import { useIsWrapped } from '../useIsWrapped'
import { useProfile } from '../useProfile'
import { useResolverHasInterfaces } from '../useResolverHasInterfaces'
import { useResolverIsAuthorised } from './useResolverIsAuthorised'

vi.mock('wagmi')

vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/useIsWrapped')
vi.mock('@app/hooks/useResolverHasInterfaces')

const mockUseEstimateGas = mockFunction(useEstimateGas)
const mockUseConnectorClient = mockFunction(useConnectorClient)

const mockUseProfile = mockFunction(useProfile)
const mockUseIsWrapped = mockFunction(useIsWrapped)
const mockUseResolverHasInterfaces = mockFunction(useResolverHasInterfaces)

describe('useResolverIsAuthorised', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseIsWrapped.mockReturnValue({
      data: false,
    })
    mockUseConnectorClient.mockReturnValue({
      data: {
        account: {
          type: 'json-rpc',
          address: '0x1234',
        },
      },
    })
    mockUseEstimateGas.mockReturnValue({
      data: {
        request: {
          gas: 0x1234n,
        },
      },
    })
  })
  it('should return isValid and isAuthorised is true if resolver is known and name is not wrapped', async () => {
    mockUseProfile.mockReturnValue({
      data: {
        resolverAddress: '0xlatestresolver',
      },
    })
    mockUseIsWrapped.mockReturnValue({
      data: false,
    })
    mockUseResolverHasInterfaces.mockReturnValue({
      data: [true],
      knownResolverData: {
        isNameWrapperAware: true,
      },
    })
    const { result } = renderHook(() => useResolverIsAuthorised({ name: 'test.eth' }))
    await waitFor(() => result.current.data !== undefined)
    expect(result.current.data).toMatchObject({
      isAuthorised: true,
      isValid: true,
    })
  })

  it('should return isValid and isAuthorised is false if resolver is not namewrapper aware and name is wrapped', async () => {
    mockUseProfile.mockReturnValue({
      data: {
        resolverAddress: '0xnamewrapperunaware',
      },
      isLoading: false,
    })
    mockUseIsWrapped.mockReturnValue({
      data: true,
    })
    mockUseResolverHasInterfaces.mockReturnValue({
      data: [true],
      knownResolverData: {
        isNameWrapperAware: false,
      },
    })
    const { result } = renderHook(() => useResolverIsAuthorised({ name: 'test.eth' }))
    await waitFor(() => result.current.data !== undefined)
    expect(mockUseProfile).toHaveBeenCalled()
    expect(result.current.data).toMatchObject({
      isAuthorised: false,
      isValid: true,
    })
  })

  it('should return isValid and isAuthorized is true if resolver is namewrapper aware and name is wrapped', async () => {
    mockUseProfile.mockReturnValue({
      data: {
        resolverAddress: '0xlatestresolver',
      },
      isLoading: false,
    })
    mockUseIsWrapped.mockReturnValue({
      data: true,
    })
    mockUseResolverHasInterfaces.mockReturnValue({
      data: [true],
      knownResolverData: {
        isNameWrapperAware: true,
      },
    })
    const { result } = renderHook(() => useResolverIsAuthorised({ name: 'test.eth' }))
    await waitFor(() => result.current.data !== undefined)
    expect(mockUseProfile).toHaveBeenCalled()
    expect(result.current.data).toMatchObject({
      isAuthorised: true,
      isValid: true,
    })
  })

  it('should return isValid=false/isAuthorised=false if resolver does not support multicoin', async () => {
    mockUseProfile.mockReturnValue({
      data: {
        resolverAddress: '0xoldresolver',
      },
      isLoading: false,
    })
    mockUseResolverHasInterfaces.mockReturnValue({
      data: [false],
    })
    const { result } = renderHook(() => useResolverIsAuthorised({ name: 'test.eth' }))
    await waitFor(() => result.current.data !== undefined)
    expect(result.current.data).toMatchObject({
      isAuthorised: false,
      isValid: false,
    })
  })

  it('should return isValid=true/isAuthorised=false if resolver auth check fails', async () => {
    mockUseProfile.mockReturnValue({
      data: {
        resolverAddress: '0xunauthorisedresolver',
      },
      isLoading: false,
    })
    mockUseResolverHasInterfaces.mockReturnValue({
      data: [true],
    })
    mockUseEstimateGas.mockReturnValue({
      isError: true,
    })
    const { result } = renderHook(() => useResolverIsAuthorised({ name: 'test.eth' }))
    await waitFor(() => result.current.data !== undefined)
    expect(result.current.data).toMatchObject({
      isAuthorised: false,
      isValid: true,
    })
  })

  it('should return data is undefined if name is empty', () => {
    const { result } = renderHook(() => useResolverIsAuthorised({ name: undefined as any }))
    expect(result.current.data).toBe(undefined)
  })
})
