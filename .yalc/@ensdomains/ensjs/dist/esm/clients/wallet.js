import { createWalletClient, } from 'viem';
import { addEnsContracts } from '../contracts/addEnsContracts.js';
import { ensWalletActions } from './decorators/wallet.js';
/**
 * Creates an ENS Wallet Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsWalletClientConfig}
 * @returns An ENS Wallet Client. {@link EnsWalletClient}
 *
 * @example
 * import { custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsWalletClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 */
export const createEnsWalletClient = ({ account, chain, key = 'ensWallet', name = 'ENS Wallet Client', transport, pollingInterval, }) => {
    return createWalletClient({
        account,
        chain: addEnsContracts(chain),
        key,
        name,
        pollingInterval,
        transport,
    }).extend(ensWalletActions);
};
//# sourceMappingURL=wallet.js.map