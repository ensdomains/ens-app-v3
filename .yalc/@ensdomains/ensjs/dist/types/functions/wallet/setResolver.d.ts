import { type Account, type Address, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
export type SetResolverDataParameters = {
    /** Name to set resolver for */
    name: string;
    /** Contract to set resolver on */
    contract: 'registry' | 'nameWrapper';
    /** Resolver address to set */
    resolverAddress: Address;
};
export type SetResolverDataReturnType = SimpleTransactionRequest;
export type SetResolverParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<SetResolverDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type SetResolverReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, resolverAddress }: SetResolverDataParameters) => SetResolverDataReturnType;
/**
 * Sets a resolver for a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetResolverParameters}
 * @returns Transaction hash. {@link SetResolverReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setResolver } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setResolver(wallet, {
 *   name: 'ens.eth',
 *   contract: 'registry',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
declare function setResolver<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, resolverAddress, ...txArgs }: SetResolverParameters<TChain, TAccount, TChainOverride>): Promise<SetResolverReturnType>;
declare namespace setResolver {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, resolverAddress }: SetResolverDataParameters) => SimpleTransactionRequest;
}
export default setResolver;
//# sourceMappingURL=setResolver.d.ts.map