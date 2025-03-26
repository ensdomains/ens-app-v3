import { type Account, type Address, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
type BaseTransferNameDataParameters = {
    /** Name to transfer */
    name: string;
    /** Transfer recipient */
    newOwnerAddress: Address;
    /** Contract to use for transfer */
    contract: 'registry' | 'nameWrapper' | 'registrar';
    /** Reclaim ownership as registrant (registrar only) */
    reclaim?: boolean;
    /** Transfer name as the parent owner */
    asParent?: boolean;
};
type RegistryOrNameWrapperTransferNameDataParameters = {
    contract: 'registry' | 'nameWrapper';
    reclaim?: never;
};
type BaseRegistrarTransferNameDataParameters = {
    contract: 'registrar';
    reclaim?: boolean;
    asParent?: never;
};
export type TransferNameDataParameters = BaseTransferNameDataParameters & (RegistryOrNameWrapperTransferNameDataParameters | BaseRegistrarTransferNameDataParameters);
export type TransferNameDataReturnType = SimpleTransactionRequest;
export type TransferNameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<TransferNameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type TransferNameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, contract, reclaim, asParent, }: TransferNameDataParameters) => TransferNameDataReturnType;
/**
 * Transfers a name to a new owner.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link TransferNameParameters}
 * @returns Transaction hash. {@link TransferNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { transferName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await transferName(wallet, {
 *   name: 'ens.eth',
 *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   contract: 'registry',
 * })
 * // 0x...
 */
declare function transferName<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, contract, reclaim, asParent, ...txArgs }: TransferNameParameters<TChain, TAccount, TChainOverride>): Promise<TransferNameReturnType>;
declare namespace transferName {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, newOwnerAddress, contract, reclaim, asParent, }: TransferNameDataParameters) => SimpleTransactionRequest;
}
export default transferName;
//# sourceMappingURL=transferName.d.ts.map