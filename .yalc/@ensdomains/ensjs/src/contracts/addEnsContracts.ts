import type { Chain } from 'viem'
import { NoChainError, UnsupportedNetworkError } from '../errors/contracts.js'
import {
  addresses,
  subgraphs,
  supportedChains,
  type ChainWithEns,
  type SupportedChain,
} from './consts.js'

/**
 * Adds ENS contract addresses to the viem chain
 * @param chain - The viem {@link Chain} object to add the ENS contracts to
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 */
export const addEnsContracts = <TChain extends Chain>(chain: TChain) => {
  if (!chain) throw new NoChainError()
  if (!supportedChains.includes(chain.network as SupportedChain))
    throw new UnsupportedNetworkError({
      network: chain.network,
      supportedNetworks: supportedChains,
    })
  return {
    ...chain,
    contracts: {
      ...chain.contracts,
      ...addresses[chain.network as SupportedChain],
    },
    subgraphs: {
      ...subgraphs[chain.network as SupportedChain],
    },
  } as ChainWithEns<TChain>
}
