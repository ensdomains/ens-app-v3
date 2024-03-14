import { renderHook, waitFor } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'
import { RESOLVER_INTERFACE_IDS, ResolverInterfaceName } from '@app/constants/resolverInterfaceIds'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'

const ResolverAddresses = KNOWN_RESOLVER_DATA[1]!

const interfaceIdToName = (interfaceId: string) =>
  Object.entries(RESOLVER_INTERFACE_IDS).find(
    ([, value]) => value === interfaceId,
  )![0] as ResolverInterfaceName

describe('useResolverHasInterfaces', () => {
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
