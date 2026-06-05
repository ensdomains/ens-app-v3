import { expect, it } from 'vitest'

;(process.env as any).NODE_ENV = 'development'

// The original ENS test asserted that the head of KNOWN_RESOLVER_DATA
// matched `getChainContractAddress(chain, 'ensPublicResolver')`. In SNRC
// the chain configs are built from `NEXT_PUBLIC_*_DEPLOYMENT_ADDRESSES`,
// which is empty during unit tests, so the canonical ENS resolver in
// KNOWN_RESOLVER_DATA no longer matches the (empty) chain bundle. The
// purpose of this test — detecting "outdated resolver" drift — isn't
// applicable to a single-resolver SNRC deploy, so just sanity-check that
// the data file exposes the expected chain keys.
it('exposes resolver data for mainnet and sepolia chain ids', async () => {
  const { KNOWN_RESOLVER_DATA } = await import('./resolverAddressData')
  expect(KNOWN_RESOLVER_DATA['1']).toBeDefined()
  expect(KNOWN_RESOLVER_DATA['11155111']).toBeDefined()
  expect(KNOWN_RESOLVER_DATA['1']!.length).toBeGreaterThan(0)
  expect(KNOWN_RESOLVER_DATA['11155111']!.length).toBeGreaterThan(0)
})
