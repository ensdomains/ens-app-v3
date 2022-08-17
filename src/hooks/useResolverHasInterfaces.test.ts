import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { mockFunction, renderHook } from '@app/test-utils'
import { KnownResolveAddresses } from '@app/validators/validateResolver'
import { useNetwork, useProvider } from 'wagmi'

jest.mock('wagmi')

const mockUseProvider = mockFunction(useProvider)
const mockUseNetwork = mockFunction(useNetwork)

const ResolverAddresses = Object.keys(KnownResolveAddresses) as string[]

describe('useRegistrationStatus', () => {
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
      const { result, waitForNextUpdate } = renderHook(() =>
        useResolverHasInterfaces(interfaces, address, false),
      )
      await waitForNextUpdate()
      expect(result.current.hasInterface).toBe(true)
    })
  })
})
