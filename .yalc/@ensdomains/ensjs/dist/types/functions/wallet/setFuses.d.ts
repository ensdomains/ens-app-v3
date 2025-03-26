import { type Account, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import { type EncodeChildFusesInputObject } from '../../utils/fuses.js';
export type SetFusesDataParameters = {
    /** Name to set fuses for */
    name: string;
    /** Fuse object to set to */
    fuses: EncodeChildFusesInputObject;
};
export type SetFusesDataReturnType = SimpleTransactionRequest;
export type SetFusesParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<SetFusesDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type SetFusesReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, fuses }: SetFusesDataParameters) => SetFusesDataReturnType;
/**
 * Sets the fuses for a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetFusesParameters}
 * @returns Transaction hash. {@link SetFusesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setFuses } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setFuses(wallet, {
 *   name: 'sub.ens.eth',
 *   fuses: {
 *     named: ['CANNOT_TRANSFER'],
 *   },
 * })
 * // 0x...
 */
declare function setFuses<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, fuses, ...txArgs }: SetFusesParameters<TChain, TAccount, TChainOverride>): Promise<SetFusesReturnType>;
declare namespace setFuses {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, fuses }: SetFusesDataParameters) => SimpleTransactionRequest;
}
export default setFuses;
//# sourceMappingURL=setFuses.d.ts.map