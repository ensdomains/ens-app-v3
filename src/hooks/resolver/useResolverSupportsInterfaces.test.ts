// TODO: Delete test. This hook is no longer in use. Keep test for now to compare with updated hook
// @ts-nocheck

import { renderHook } from "@app/test-utils"
import { useResolverSupportsInterfaces } from "./useResolverSupportsInterfaces"
import { ResolverInterfaceName } from "@app/constants/resolverInterfaceIds"

const mockSupportsInterface = jest.fn().mockReturnValue(true)
jest.mock('@ethersproject/contracts', () => ({
  Contract: class {
    async supportsInterface() {
      return mockSupportsInterface()
    }
  }
}))

describe('useResolverSupportsInterface', () => {
  it('should return object with interface as key and value is true if supportsInterface returns true', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useResolverSupportsInterfaces({
      resolverAddress: '0xresolver',
      interfaces: ['AddressResolver'] as ResolverInterfaceName[]
    }))
    await waitForNextUpdate()
    expect(result.current.data).toEqual({AddressResolver: true})
  })

  it('should return object with interface as key and value is false if supportsInterface returns false', async () => {
    mockSupportsInterface.mockReturnValue(false)
    const { result, waitForNextUpdate } = renderHook(() => useResolverSupportsInterfaces({
      resolverAddress: '0xresolver',
      interfaces: ['AddressResolver'] as ResolverInterfaceName[]
    }))
    await waitForNextUpdate()
    expect(result.current.data).toEqual({AddressResolver: false})
  })

  it('should return object with interface as key and value is false if supportsInterface is rejected', async () => {
    mockSupportsInterface.mockImplementation(() => Promise.reject())
    const { result, waitForNextUpdate } = renderHook(() => useResolverSupportsInterfaces({
      resolverAddress: '0xresolver',
      interfaces: ['AddressResolver'] as ResolverInterfaceName[]
    }))
    await waitForNextUpdate()
    expect(result.current.data).toEqual({AddressResolver: false})
  })
})