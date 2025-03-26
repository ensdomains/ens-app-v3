import { type Account, type Address, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Eth2ldName, Eth2ldNameSpecifier, GetNameType, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
type BaseUnwrapNameDataParameters<TName extends string> = {
    /** The name to unwrap */
    name: TName;
    /** The recipient of the unwrapped name */
    newOwnerAddress: Address;
    /** The registrant of the unwrapped name (eth-2ld only) */
    newRegistrantAddress?: Address;
};
type Eth2ldUnwrapNameDataParameters = {
    name: Eth2ldName;
    newRegistrantAddress: Address;
};
type OtherUnwrapNameDataParameters = {
    name: string;
    newRegistrantAddress?: never;
};
export type UnwrapNameDataParameters<TName extends string, TNameType extends GetNameType<TName> = GetNameType<TName>> = BaseUnwrapNameDataParameters<TName> & (TNameType extends Eth2ldNameSpecifier ? Eth2ldUnwrapNameDataParameters : OtherUnwrapNameDataParameters);
export type UnwrapNameDataReturnType = SimpleTransactionRequest;
export type UnwrapNameParameters<TName extends string, TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = UnwrapNameDataParameters<TName> & WriteTransactionParameters<TChain, TAccount, TChainOverride>;
export type UnwrapNameReturnType = Hash;
export declare const makeFunctionData: <TName extends string, TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, newRegistrantAddress, }: UnwrapNameDataParameters<TName, GetNameType<TName>>) => UnwrapNameDataReturnType;
/**
 * Unwraps a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link UnwrapNameParameters}
 * @returns Transaction hash. {@link UnwrapNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { unwrapName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await unwrapName(wallet, {
 *   name: 'example.eth',
 *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   newRegistrantAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 * })
 * // 0x...
 */
declare function unwrapName<TName extends string, TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, newRegistrantAddress, ...txArgs }: UnwrapNameParameters<TName, TChain, TAccount, TChainOverride>): Promise<UnwrapNameReturnType>;
declare namespace unwrapName {
    var makeFunctionData: <TName extends string, TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, newRegistrantAddress, }: UnwrapNameDataParameters<TName, GetNameType<TName>>) => SimpleTransactionRequest;
}
export default unwrapName;
//# sourceMappingURL=unwrapName.d.ts.map