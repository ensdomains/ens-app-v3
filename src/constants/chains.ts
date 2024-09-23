import { holesky } from 'viem/chains'
import { localhost, mainnet, sepolia } from 'wagmi/chains'

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
export const sepoliaWithEns = addEnsContracts(sepolia)
export const holeskyWithEns = addEnsContracts(holesky)

export const chainsWithEns = [
  mainnetWithEns,
  sepoliaWithEns,
  holeskyWithEns,
  localhostWithEns,
] as const

export type GetSupportedChainById<chainId extends SupportedChain['id']> = Extract<
  SupportedChain,
  { id: chainId }
>

export function getSupportedChainById<chainId extends SupportedChain['id']>(
  chainId: chainId,
): GetSupportedChainById<chainId>
export function getSupportedChainById(chainId: number | undefined): SupportedChain | undefined
export function getSupportedChainById(chainId: number | undefined) {
  if (!chainId) return undefined
  return chainsWithEns.find((c) => c.id === chainId)
}

export type SourceChain =
  | typeof mainnetWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
  | typeof localhostWithEns

// this will include L2s later
export type TargetChain = SourceChain

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
  | typeof localhostWithEns
