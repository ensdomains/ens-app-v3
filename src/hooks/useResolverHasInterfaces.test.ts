import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'
import { RESOLVER_INTERFACE_IDS, ResolverInterfaceName } from '@app/constants/resolverInterfaceIds'
import { useEffectiveResolverAddress } from '@app/hooks/resolver/useEffectiveResolverAddress'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'

import { useSupportedInterfaces } from './ensjs/public/useSupportedInterfaces'

vi.mock('@app/hooks/resolver/useEffectiveResolverAddress')
vi.mock('@app/hooks/ensjs/public/useSupportedInterfaces')

const mockUseEffectiveResolverAddress = mockFunction(useEffectiveResolverAddress)
const mockUseSupportedInterfaces = mockFunction(useSupportedInterfaces)

const ResolverAddresses = KNOWN_RESOLVER_DATA[1]!

const interfaceIdToName = (interfaceId: string) =>
  Object.entries(RESOLVER_INTERFACE_IDS).find(
    ([, value]) => value === interfaceId,
  )![0] as ResolverInterfaceName

describe('useResolverHasInterfaces', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseEffectiveResolverAddress.mockImplementation(({ resolverAddress }) => ({
      data: resolverAddress,
      isLoading: false,
      isFetching: false,
    }))
    mockUseSupportedInterfaces.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    })
  })

  it('checks interfaces on the underlying resolver for an abstracted name', () => {
    const underlyingResolver = '0x2000000000000000000000000000000000000002'
    mockUseEffectiveResolverAddress.mockReturnValueOnce({
      data: underlyingResolver,
      isAbstracted: true,
      isLoading: false,
      isFetching: false,
    })
    mockUseSupportedInterfaces.mockReturnValueOnce({ data: [true], isLoading: false })

    const { result } = renderHook(() =>
      useResolverHasInterfaces({
        name: 'test.eth',
        interfaceNames: ['MultiCoinAddressResolver'],
        resolverAddress: '0x1000000000000000000000000000000000000001',
      }),
    )

    expect(result.current.data).toEqual([true])
    expect(mockUseSupportedInterfaces).toHaveBeenCalledWith(
      expect.objectContaining({ address: underlyingResolver, enabled: true }),
    )
  })

  ResolverAddresses.forEach((item) => {
    it(`should return true for known resolver address: ${item.address}`, async () => {
      const { result } = renderHook(() =>
        useResolverHasInterfaces({
          interfaceNames: item.supportedInterfaces.map(interfaceIdToName),
          resolverAddress: item.address,
        }),
      )
      await waitFor(() => !result.current.isLoading)
      expect(result.current.data).toEqual(item.supportedInterfaces.map(() => true))
    })
  })
})
