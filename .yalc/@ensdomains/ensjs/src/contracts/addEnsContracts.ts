import type { Chain } from 'viem'
import { NoChainError, UnsupportedChainError } from '../errors/contracts.js'
import {
  addresses,
  subgraphs,
  supportedChains,
  type CheckedChainWithEns,
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
export const addEnsContracts = <const TChain extends Chain>(chain: TChain) => {
  if (!chain) throw new NoChainError()
  if (!supportedChains.includes(chain.id as SupportedChain))
    throw new UnsupportedChainError({
      chainId: chain.id,
      supportedChains,
    })
  return {
    ...chain,
    contracts: {
      ...chain.contracts,
      ...addresses[chain.id as SupportedChain],
    },
    subgraphs: {
      ...subgraphs[chain.id as SupportedChain],
    },
  } as unknown as CheckedChainWithEns<TChain>
}
