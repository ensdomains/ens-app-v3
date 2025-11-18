import type { Address, Chain } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

import { ChainWithEns, CheckedChainWithEns } from '@ensdomains/ensjs/contracts'

import { addEnsContractsWithSubgraph } from '@app/utils/chains/addEnsContractsWithSubgraph'

/**
 * Extends ChainWithEns with additional custom contracts for public chains (mainnet, sepolia)
 * Uses CheckedChainWithEns for strict type checking against known chain IDs
 */
export type ChainWithEnsAndContracts<
  TChain extends Chain,
  TAdditionalContracts extends Record<string, { address: Address }> = {},
> = Omit<TChain, 'contracts'> & {
  contracts: CheckedChainWithEns<TChain>['contracts'] & TAdditionalContracts
}

/**
 * Extends ChainWithEns with additional custom contracts for localhost
 * Does not use CheckedChainWithEns since localhost has dynamically generated addresses
 */
export type LocalhostChainWithEnsAndContracts<
  TChain extends Chain,
  TAdditionalContracts extends Record<string, { address: Address }> = {},
> = Omit<ChainWithEns<TChain>, 'contracts'> & {
  contracts: ChainWithEns<TChain>['contracts'] & TAdditionalContracts
}

const supportedChains = [mainnet.id, sepolia.id] as const
type SupportedChain = (typeof supportedChains)[number]
const isSupportedChain = (chainId?: number): chainId is SupportedChain =>
  !!chainId && supportedChains.includes(chainId as SupportedChain)

const overrideContracts = ['wrappedRenewalWithReferrer'] as const
type OverrideContracts = (typeof overrideContracts)[number]

const addresses = {
  [mainnet.id]: {
    wrappedRenewalWithReferrer: {
      address: '0xf55575bde5953ee4272d5ce7cdd924c74d8fa81a' as Address,
    },
  },
  [sepolia.id]: {
    wrappedRenewalWithReferrer: {
      address: '0x7ab2947592c280542e680ba8f08a589009da8644' as Address,
    },
  },
} as const satisfies Record<SupportedChain, Record<OverrideContracts, { address: Address }>>

export type AdditionalContracts = Record<OverrideContracts, { address: Address }>

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
      ...(isSupportedChain(chain.id) ? addresses[chain.id] : addresses['1']),
      ensBulkRenewal: chainWithEns.contracts.wrappedBulkRenewal,
    },
  } as const satisfies ChainWithEnsAndContracts<TChain, AdditionalContracts>
}
