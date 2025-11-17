import type { Address, Chain } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

import { addEnsContractsWithSubgraph } from '@app/utils/chains/addEnsContractsWithSubgraph'

const supportedChains = [mainnet.id, sepolia.id] as const
type SupportedChain = (typeof supportedChains)[number]
const isSupportedChain = (chainId?: number): chainId is SupportedChain =>
  !!chainId && supportedChains.includes(chainId as SupportedChain)

const overrideContracts = ['wrappedRenewalWithReferrer'] as const
type OverrideContracts = (typeof overrideContracts)[number]

const addresses = {
  [mainnet.id]: {
    wrappedRenewalWithReferrer: {
      address: '0xf55575bde5953ee4272d5ce7cdd924c74d8fa81a',
    },
  },
  [sepolia.id]: {
    wrappedRenewalWithReferrer: {
      address: '0x7ab2947592c280542e680ba8f08a589009da8644',
    },
  },
} as const satisfies Record<SupportedChain, Record<OverrideContracts, { address: Address }>>

/**
 * Wrapper function for addEnsContractsWithSubgraph that allows additional contract overrides.
 *
 * This function currently passes through the results from addEnsContractsWithSubgraph,
 * but provides a central location for adding contract address overrides or additional
 * contract information in the future.
 *
 * @param params - Chain configuration with subgraph details
 * @returns Chain with ENS contracts and subgraph configuration
 */
export const addEnsContractsWithSubgraphAndOverrides = <const TChain extends Chain>({
  chain,
  subgraphId,
  apiKey,
}: {
  chain: TChain
  subgraphId: string
  apiKey: string
}) => {
  const chainWithEns = addEnsContractsWithSubgraph({ chain, subgraphId, apiKey })

  return {
    ...chainWithEns,
    contracts: {
      ...chainWithEns.contracts,
      ...(isSupportedChain(chain.id) ? addresses[chain.id] : {}),
    },
  } as const
}
