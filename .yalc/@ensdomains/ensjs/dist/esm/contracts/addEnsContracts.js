import { NoChainError, UnsupportedChainError } from '../errors/contracts.js';
import { addresses, subgraphs, supportedChains, } from './consts.js';
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
export const addEnsContracts = (chain) => {
    if (!chain)
        throw new NoChainError();
    if (!supportedChains.includes(chain.id))
        throw new UnsupportedChainError({
            chainId: chain.id,
            supportedChains,
        });
    return {
        ...chain,
        contracts: {
            ...chain.contracts,
            ...addresses[chain.id],
        },
        subgraphs: {
            ...subgraphs[chain.id],
        },
    };
};
//# sourceMappingURL=addEnsContracts.js.map