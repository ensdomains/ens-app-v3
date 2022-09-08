import { mockFunction, renderHook } from '@app/test-utils'

import { useNetwork, useProvider } from 'wagmi'

import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { KnownResolveAddresses } from '@app/validators/validateResolver'

jest.mock('wagmi', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useNetwork: jest.fn(),
  useProvider: jest.fn(),
}))

const mockUseProvider = mockFunction(useProvider)
const mockUseNetwork = mockFunction(useNetwork)

const ResolverAddresses = Object.keys(KnownResolveAddresses) as string[]

describe('useResolverHasInterfaces', () => {
  beforeEach(() => {
    mockUseProvider.mockReturnValue({})
    mockUseNetwork.mockReturnValue({
      chain: {
        id: 1,
      },
    })
  })

  ResolverAddresses.forEach((address) => {
    it(`should return true for known resolver address: ${address}`, async () => {
      const interfaces = KnownResolveAddresses[address].supportedInterfaces
      const { result, waitForValueToChange } = renderHook(() =>
        useResolverHasInterfaces(interfaces, address, false),
      )
      await waitForValueToChange(() => result.current.isLoading)
      expect(result.current.hasInterface).toBe(true)
    })
  })
})
