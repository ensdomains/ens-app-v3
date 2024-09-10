import { getChainContractAddress } from 'viem/utils'
import { describe, expect, it } from 'vitest'

import { holeskyWithEns, localhostWithEns, mainnetWithEns, sepoliaWithEns } from './chains'

;(process.env as any).NODE_ENV = 'development'

it('should have the most recent resolver as the first address', async () => {
  // dynamic import for NODE_ENV to be set
  const { KNOWN_RESOLVER_DATA } = await import('./resolverAddressData')

  expect(KNOWN_RESOLVER_DATA['1']![0].address).toEqual(
    getChainContractAddress({ chain: mainnetWithEns, contract: 'ensPublicResolver' }),
  )
  expect(KNOWN_RESOLVER_DATA['17000']![0].address).toEqual(
    getChainContractAddress({ chain: holeskyWithEns, contract: 'ensPublicResolver' }),
  )
  expect(KNOWN_RESOLVER_DATA['11155111']![0].address).toEqual(
    getChainContractAddress({ chain: sepoliaWithEns, contract: 'ensPublicResolver' }),
  )
  // localhost is not included by default in the resolver data
  // expect(KNOWN_RESOLVER_DATA['1337']![0].address).toEqual(
  //   getChainContractAddress({ chain: localhostWithEns, contract: 'ensPublicResolver' }),
  // )
})
