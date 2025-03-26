import { type Account, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import { type EncodeFusesInputObject } from '../../utils/fuses.js';
export type SetChildFusesDataParameters = {
    /** Name to set child fuses for */
    name: string;
    /** Fuse object or number value to set to */
    fuses: EncodeFusesInputObject;
    /** Expiry to set for fuses */
    expiry?: number | bigint;
};
export type SetChildFusesDataReturnType = SimpleTransactionRequest;
export type SetChildFusesParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<SetChildFusesDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type SetChildFusesReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, fuses, expiry }: SetChildFusesDataParameters) => SetChildFusesDataReturnType;
/**
 * Sets the fuses for a name as the parent.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetChildFusesParameters}
 * @returns Transaction hash. {@link SetChildFusesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setChildFuses } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setChildFuses(wallet, {
 *   name: 'sub.ens.eth',
 *   fuses: {
 *     parent: {
 *       named: ['PARENT_CANNOT_CONTROl'],
 *     },
 *   },
 * })
 * // 0x...
 */
declare function setChildFuses<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, fuses, expiry, ...txArgs }: SetChildFusesParameters<TChain, TAccount, TChainOverride>): Promise<SetChildFusesReturnType>;
declare namespace setChildFuses {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, fuses, expiry }: SetChildFusesDataParameters) => SimpleTransactionRequest;
}
export default setChildFuses;
//# sourceMappingURL=setChildFuses.d.ts.map