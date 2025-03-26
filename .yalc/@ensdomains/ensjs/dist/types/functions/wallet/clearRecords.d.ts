import type { Account, Address, Hash, Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
export type ClearRecordsDataParameters = {
    /** The name to clear records for */
    name: string;
    /** The resolver address to use */
    resolverAddress: Address;
};
export type ClearRecordsDataReturnType = SimpleTransactionRequest;
export type ClearRecordsParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<ClearRecordsDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type ClearRecordsReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(_wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, resolverAddress }: ClearRecordsDataParameters) => ClearRecordsDataReturnType;
/**
 * Clears the records for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link ClearRecordsParameters}
 * @returns Transaction hash. {@link ClearRecordsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { clearRecords } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await clearRecords(wallet, {
 *   name: 'ens.eth',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
declare function clearRecords<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, resolverAddress, ...txArgs }: ClearRecordsParameters<TChain, TAccount, TChainOverride>): Promise<ClearRecordsReturnType>;
declare namespace clearRecords {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(_wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, resolverAddress }: ClearRecordsDataParameters) => SimpleTransactionRequest;
}
export default clearRecords;
//# sourceMappingURL=clearRecords.d.ts.map