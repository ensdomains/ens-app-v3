import type { Chain } from 'viem';
import { type CheckedChainWithEns } from './consts.js';
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
export declare const addEnsContracts: <const TChain extends Chain>(chain: TChain) => CheckedChainWithEns<TChain>;
//# sourceMappingURL=addEnsContracts.d.ts.map