import type { Chain } from 'viem'
import { holesky } from 'viem/chains'
import { goerli, localhost, mainnet, sepolia } from 'wagmi/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

import type { Register } from '@app/local-contracts'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEns<typeof localhost>(
  localhost,
  deploymentAddresses,
)

const ENS_SUBGRAPH_API_KEY = '9ad5cff64d93ed2c33d1a57b3ec03ea9'

export const mainnetWithEns = {
  ...addEnsContracts(mainnet),
  subgraphs: {
    ens: {
      url: `https://gateway-arbitrum.network.thegraph.com/api/${ENS_SUBGRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`,
    },
  },
}
export const goerliWithEns = addEnsContracts(goerli)
export const sepoliaWithEns = addEnsContracts(sepolia)
export const holeskyWithEns = addEnsContracts(holesky)

console.log('sepoliawithens', sepoliaWithEns)

export const odysseyWithEns = {
  id: 911_867,
  name: 'Odyssey',
  nativeCurrency: {
    decimals: 18,
    name: 'Conduit',
    symbol: 'CON',
  },
  rpcUrls: {
    public: { http: ['https://odyssey.ithaca.xyz'] },
    default: { http: ['https://odyssey.ithaca.xyz'] },
  },
  blockExplorers: {
    odysseyExplorer: { name: 'Odyssey Explorer', url: 'https://odyssey-explorer.ithaca.xyz' },
    default: { name: 'Odyssey Explorer', url: 'https://odyssey-explorer.ithaca.xyz' },
  },
  contracts: {
    ensBaseRegistrarImplementation: { address: '0x017845E4518dB01EFCAFd7Acb192aF924B432d66' },
    ensBulkRenewal: { address: '0x432C01F19D7517Ac2d4328d75e6c16B2704DE011' },
    ensDnsRegistrar: { address: '0xfdF30e5E06d728704A42bac6E0326538E659a67B' },
    ensDnssecImpl: { address: '0xDD8f96E422681e7ea04b46b0151A5b9043348fF1' },
    ensEthRegistrarController: { address: '0x2D6e4FDbC2CF9422CEa8fA79c4b6AC517D32cd18' },
    ensNameWrapper: { address: '0x300238a6aFeE3a6e6DCD278c244b5064AC4Fc729' },
    ensPublicResolver: { address: '0x9F3C37A6cDd5ECA7b27140856753EDBF387c06bB' },
    ensRegistry: { address: '0x0e8DA38565915B7e74e2d78F80ba1BF815F34116' },
    ensReverseRegistrar: { address: '0x3d6BBfDCe5C484D9177F3a7d30e3bfe7Add5051E' },
    ensUniversalResolver: { address: '0xE00739Fc93e27aBf44343fD5FAA151c67C0A0Aa3' },
    multicall3: { address: '0xca11bde05977b3631167028862be2a173976ca11', blockCreated: 751532 },
  },
  subgraphs: {
    ens: {
      url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    },
  },
  testnet: true,
} as const satisfies Chain

export const chainsWithEns = [
  mainnetWithEns,
  goerliWithEns,
  sepoliaWithEns,
  holeskyWithEns,
  localhostWithEns,
  odysseyWithEns,
] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof goerliWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
  | typeof localhostWithEns
  | typeof odysseyWithEns
