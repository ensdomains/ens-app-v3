import { type Account, type Address, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Eth2ldNameSpecifier, GetNameType, Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import { type EncodeChildFusesInputObject } from '../../utils/fuses.js';
export type WrapNameDataParameters<TName extends string, TNameOption extends GetNameType<TName> = GetNameType<TName>> = {
    /** The name to wrap */
    name: TName;
    /** The recipient of the wrapped name */
    newOwnerAddress: Address;
    /** Fuses to set on wrap (eth-2ld only) */
    fuses?: TNameOption extends Eth2ldNameSpecifier ? EncodeChildFusesInputObject : never;
    /** The resolver address to set on wrap */
    resolverAddress?: Address;
};
export type WrapNameDataReturnType = SimpleTransactionRequest;
export type WrapNameParameters<TName extends string, TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<WrapNameDataParameters<TName> & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type WrapNameReturnType = Hash;
export declare const makeFunctionData: <TName extends string, TChain extends ChainWithEns, TAccount extends Account>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, fuses, resolverAddress, }: WrapNameDataParameters<TName, GetNameType<TName>>) => WrapNameDataReturnType;
/**
 * Wraps a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link WrapNameParameters}
 * @returns Transaction hash. {@link WrapNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { wrapName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await wrapName(wallet, {
 *   name: 'ens.eth',
 *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 * })
 * // 0x...
 */
declare function wrapName<TName extends string, TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, fuses, resolverAddress, ...txArgs }: WrapNameParameters<TName, TChain, TAccount, TChainOverride>): Promise<WrapNameReturnType>;
declare namespace wrapName {
    var makeFunctionData: <TName extends string, TChain extends ChainWithEns, TAccount extends Account>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, fuses, resolverAddress, }: WrapNameDataParameters<TName, GetNameType<TName>>) => SimpleTransactionRequest;
}
export default wrapName;
//# sourceMappingURL=wrapName.d.ts.map