import { type Account, type Address, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
type BaseSetPrimaryNameDataParameters = {
    /** The name to set as primary */
    name: string;
    /** The address to set the primary name for */
    address?: Address;
    /** The resolver address to use */
    resolverAddress?: Address;
};
type SelfSetPrimaryNameDataParameters = {
    address?: never;
    resolverAddress?: never;
};
type OtherSetPrimaryNameDataParameters = {
    address: Address;
    resolverAddress?: Address;
};
export type SetPrimaryNameDataParameters = BaseSetPrimaryNameDataParameters & (SelfSetPrimaryNameDataParameters | OtherSetPrimaryNameDataParameters);
export type SetPrimaryNameDataReturnType = SimpleTransactionRequest;
export type SetPrimaryNameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<SetPrimaryNameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type SetPrimaryNameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, address, resolverAddress, }: SetPrimaryNameDataParameters) => SetPrimaryNameDataReturnType;
/**
 * Sets a primary name for an address.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetPrimaryNameParameters}
 * @returns Transaction hash. {@link SetPrimaryNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setPrimaryName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setPrimaryName(wallet, {
 *   name: 'ens.eth',
 * })
 * // 0x...
 */
declare function setPrimaryName<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, address, resolverAddress, ...txArgs }: SetPrimaryNameParameters<TChain, TAccount, TChainOverride>): Promise<SetPrimaryNameReturnType>;
declare namespace setPrimaryName {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, address, resolverAddress, }: SetPrimaryNameDataParameters) => SimpleTransactionRequest;
}
export default setPrimaryName;
//# sourceMappingURL=setPrimaryName.d.ts.map