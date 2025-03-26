import { type Account, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
export type RenewNamesDataParameters = {
    /** Name or names to renew */
    nameOrNames: string | string[];
    /** Duration to renew name(s) for */
    duration: bigint | number;
    /** Value of all renewals */
    value: bigint;
};
export type RenewNamesDataReturnType = SimpleTransactionRequest & {
    value: bigint;
};
export type RenewNamesParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<RenewNamesDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type RenewNamesReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { nameOrNames, duration, value }: RenewNamesDataParameters) => RenewNamesDataReturnType;
/**
 * Renews a name or names for a specified duration.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link RenewNamesParameters}
 * @returns Transaction hash. {@link RenewNamesReturnType}
 *
 * @example
 * import { createPublicClient, createWalletClient, http, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getPrice } from '@ensdomains/ensjs/public'
 * import { renewNames } from '@ensdomains/ensjs/wallet'
 *
 * const mainnetWithEns = addEnsContracts(mainnet)
 * const client = createPublicClient({
 *   chain: mainnetWithEns,
 *   transport: http(),
 * })
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 *
 * const duration = 31536000 // 1 year
 * const { base, premium } = await getPrice(wallet, {
 *  nameOrNames: 'example.eth',
 *  duration,
 * })
 * const value = (base + premium) * 110n / 100n // add 10% to the price for buffer
 * const hash = await renewNames(wallet, {
 *   nameOrNames: 'example.eth',
 *   duration,
 *   value,
 * })
 * // 0x...
 */
declare function renewNames<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { nameOrNames, duration, value, ...txArgs }: RenewNamesParameters<TChain, TAccount, TChainOverride>): Promise<RenewNamesReturnType>;
declare namespace renewNames {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { nameOrNames, duration, value }: RenewNamesDataParameters) => RenewNamesDataReturnType;
}
export default renewNames;
//# sourceMappingURL=renewNames.d.ts.map