import { waitFor, mockFunction } from '@app/test-utils'
import validateResolver, { KnownResolveAddresses } from './validateResolver'
import validateContract, { CONTRACT_INTERFACES } from './validateContract'

jest.mock('@app/validators/validateContract')

const mockValidateContract = mockFunction(validateContract)

const ResolverAddresses = Object.keys(KnownResolveAddresses) as Array<
  keyof typeof KnownResolveAddresses
>

const contractInterfaces = Object.keys(CONTRACT_INTERFACES) as Array<
  keyof typeof CONTRACT_INTERFACES
>

describe('validateResolver', () => {
  ResolverAddresses.forEach((address) => {
    it(`should return hard coded results for known resolver address: ${address}`, async () => {
      const result = await validateResolver(
        contractInterfaces,
        address as string,
        {},
        undefined,
      )

      const errors = contractInterfaces
        .map((interfaceName) => {
          if (
            KnownResolveAddresses[address].supportedInterfaces.includes(
              interfaceName,
            )
          ) {
            return undefined
          }
          return CONTRACT_INTERFACES[interfaceName].error
        })
        .filter((x) => x)

      expect(result).toEqual(errors)
    })
  })

  it('should call validateContract for unknown addresses', async () => {
    await validateResolver(
      [
        'IAddrResolver',
        'IAddressResolver',
        'INameResolver',
        'IABIResolver',
        'IPubkeyResolver',
        'ITextResolver',
        'IContentHashResolver',
        'IDNSRecordResolver',
        'IInterfaceResolver',
      ],
      '0xdaaf96c344f63131acadd0ea35170e7892d3dfbb',
      {},
      undefined,
    )
    await waitFor(() => {
      expect(mockValidateContract).toBeCalled()
    })
  })
})
