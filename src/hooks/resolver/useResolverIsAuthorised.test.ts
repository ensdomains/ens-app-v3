import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { usePrepareContractWrite, useWalletClient } from 'wagmi'

import { useIsWrapped } from '../useIsWrapped'
import { useProfile } from '../useProfile'
import { useResolverHasInterfaces } from '../useResolverHasInterfaces'
import { useResolverIsAuthorised } from './useResolverIsAuthorised'

jest.mock('@app/hooks/useProfile')
jest.mock('@app/hooks/useIsWrapped')
jest.mock('@app/hooks/useResolverHasInterfaces')

const mockUseProfile = mockFunction(useProfile)
const mockUseIsWrapped = mockFunction(useIsWrapped)
const mockUseWalletClient = mockFunction(useWalletClient)
const mockUsePrepareContractWrite = mockFunction(usePrepareContractWrite)
const mockUseResolverHasInterfaces = mockFunction(useResolverHasInterfaces)

describe('useResolverIsAuthorised', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseIsWrapped.mockReturnValue({
      data: false,
    })
    mockUseWalletClient.mockReturnValue({
      data: {
        account: {
          type: 'json-rpc',
          address: '0x1234',
        },
      },
    })
    mockUsePrepareContractWrite.mockReturnValue({
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
    mockUsePrepareContractWrite.mockReturnValue({
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
