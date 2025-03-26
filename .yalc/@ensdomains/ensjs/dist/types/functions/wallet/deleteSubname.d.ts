import { type Account, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
export type DeleteSubnameDataParameters = {
    /** Subname to delete */
    name: string;
    /** Contract to delete subname on */
    contract: 'registry' | 'nameWrapper';
    /** If true, deletes via owner methods, otherwise will delete via parent owner methods */
    asOwner?: boolean;
};
export type DeleteSubnameDataReturnType = SimpleTransactionRequest;
export type DeleteSubnameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<DeleteSubnameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type DeleteSubnameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, asOwner }: DeleteSubnameDataParameters) => DeleteSubnameDataReturnType;
/**
 * Deletes a subname
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link DeleteSubnameParameters}
 * @returns Transaction hash. {@link DeleteSubnameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { deleteSubname } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await deleteSubname(wallet, {
 *   name: 'sub.ens.eth',
 *   contract: 'registry',
 * })
 * // 0x...
 */
declare function deleteSubname<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, asOwner, ...txArgs }: DeleteSubnameParameters<TChain, TAccount, TChainOverride>): Promise<DeleteSubnameReturnType>;
declare namespace deleteSubname {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, asOwner }: DeleteSubnameDataParameters) => SimpleTransactionRequest;
}
export default deleteSubname;
//# sourceMappingURL=deleteSubname.d.ts.map