'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const ethers_1 = require('ethers')
async function default_1(
  { contracts, provider },
  name,
  contract,
  resolver,
  options,
) {
  const address = await provider
    ?.getSigner(options?.addressOrIndex)
    .getAddress()
  if (!address) {
    throw new Error('No signer found')
  }
  if (!resolver) {
    resolver = (await contracts?.getPublicResolver()).address
  }
  switch (contract) {
    case 'registry': {
      const registry = (await contracts?.getRegistry()).connect(
        provider?.getSigner(options?.addressOrIndex),
      )
      return registry.setResolver(
        ethers_1.ethers.utils.namehash(name),
        resolver,
      )
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts?.getNameWrapper()).connect(
        provider?.getSigner(options?.addressOrIndex),
      )
      return nameWrapper.setResolver(
        ethers_1.ethers.utils.namehash(name),
        resolver,
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
exports.default = default_1
