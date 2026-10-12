import { getChainContractAddress } from 'viem/utils'
import { describe, expect, it } from 'vitest'

import { mainnetWithEns, sepoliaWithEns } from './chains'

;(process.env as any).NODE_ENV = 'development'

it('should have the most recent resolver as the first address', async () => {
  // dynamic import for NODE_ENV to be set
  const { KNOWN_RESOLVER_DATA } = await import('./resolverAddressData')

  expect(KNOWN_RESOLVER_DATA['1']![0].address).toEqual(
    getChainContractAddress({ chain: mainnetWithEns, contract: 'ensPublicResolver' }),
  )

  expect(KNOWN_RESOLVER_DATA['11155111']![0].address).toEqual(
    getChainContractAddress({ chain: sepoliaWithEns, contract: 'ensPublicResolver' }),
  )
  // localhost is not included by default in the resolver data
  // expect(KNOWN_RESOLVER_DATA['1337']![0].address).toEqual(
  //   getChainContractAddress({ chain: localhostWithEns, contract: 'ensPublicResolver' }),
  // )
})

const sepoliaENSV1Resolver = '0xae66c62AcAE72098BdAc57d8E8AED53EF000b2Ba'
const attackerResolver = '0xa11ce000000000000000000000000000000a11ce'

describe('isOfficialCompositeResolver', () => {
  it('has no official mainnet composite resolvers', async () => {
    const { isOfficialCompositeResolver } = await import('./resolverAddressData')
    expect(isOfficialCompositeResolver({ chainId: 1, resolverAddress: sepoliaENSV1Resolver })).toBe(
      false,
    )
  })

  it('recognises the official Sepolia ENSV1Resolver', async () => {
    const { isOfficialCompositeResolver } = await import('./resolverAddressData')
    expect(
      isOfficialCompositeResolver({
        chainId: 11155111,
        resolverAddress: sepoliaENSV1Resolver.toLowerCase(),
      }),
    ).toBe(true)
  })

  it('has no official local composite resolvers', async () => {
    const { isOfficialCompositeResolver } = await import('./resolverAddressData')
    expect(
      isOfficialCompositeResolver({ chainId: 1337, resolverAddress: sepoliaENSV1Resolver }),
    ).toBe(false)
  })

  it('does not trust an attacker resolver', async () => {
    const { isOfficialCompositeResolver } = await import('./resolverAddressData')
    expect(
      isOfficialCompositeResolver({ chainId: 11155111, resolverAddress: attackerResolver }),
    ).toBe(false)
  })
})
