import { type Account, type Address, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { AnyDate, Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import { type EncodeFusesInputObject } from '../../utils/fuses.js';
type BaseCreateSubnameDataParameters = {
    /** Subname to create */
    name: string;
    /** New owner of subname */
    owner: Address;
    /** Contract to create subname on */
    contract: 'registry' | 'nameWrapper';
    /** Resolver address to set */
    resolverAddress?: Address;
    /** Expiry to set (only on NameWrapper) */
    expiry?: AnyDate;
    /** Fuses to set (only on NameWrapper) */
    fuses?: EncodeFusesInputObject;
};
type RegistryCreateSubnameDataParameters = {
    contract: 'registry';
    expiry?: never;
    fuses?: never;
};
type NameWrapperCreateSubnameDataParameters = {
    contract: 'nameWrapper';
    expiry?: AnyDate;
    fuses?: EncodeFusesInputObject;
};
export type CreateSubnameDataParameters = BaseCreateSubnameDataParameters & (RegistryCreateSubnameDataParameters | NameWrapperCreateSubnameDataParameters);
export type CreateSubnameDataReturnType = SimpleTransactionRequest;
export type CreateSubnameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<CreateSubnameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type CreateSubnameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, owner, resolverAddress, expiry, fuses, }: CreateSubnameDataParameters) => CreateSubnameDataReturnType;
/**
 * Creates a subname
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link CreateSubnameParameters}
 * @returns Transaction hash. {@link CreateSubnameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { createSubname } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await createSubname(wallet, {
 *   name: 'sub.ens.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   contract: 'registry',
 * })
 * // 0x...
 */
declare function createSubname<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, owner, resolverAddress, expiry, fuses, ...txArgs }: CreateSubnameParameters<TChain, TAccount, TChainOverride>): Promise<CreateSubnameReturnType>;
declare namespace createSubname {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contract, owner, resolverAddress, expiry, fuses, }: CreateSubnameDataParameters) => SimpleTransactionRequest;
}
export default createSubname;
//# sourceMappingURL=createSubname.d.ts.map