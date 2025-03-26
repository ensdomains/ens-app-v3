import type { Account, Address, Hash, Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
export type SetTextRecordDataParameters = {
    /** The name to set a text record for */
    name: string;
    /** The text record key to set */
    key: string;
    /** The text record value to set */
    value: string | null;
    /** The resolver address to use */
    resolverAddress: Address;
};
export type SetTextRecordDataReturnType = SimpleTransactionRequest;
export type SetTextRecordParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<SetTextRecordDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type SetTextRecordReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(_wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, key, value, resolverAddress }: SetTextRecordDataParameters) => SetTextRecordDataReturnType;
/**
 * Sets a text record for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetTextRecordParameters}
 * @returns Transaction hash. {@link SetTextRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setTextRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setTextRecord(wallet, {
 *   name: 'ens.eth',
 *   key: 'foo',
 *   value: 'bar',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
declare function setTextRecord<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, key, value, resolverAddress, ...txArgs }: SetTextRecordParameters<TChain, TAccount, TChainOverride>): Promise<SetTextRecordReturnType>;
declare namespace setTextRecord {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(_wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, key, value, resolverAddress }: SetTextRecordDataParameters) => SimpleTransactionRequest;
}
export default setTextRecord;
//# sourceMappingURL=setTextRecord.d.ts.map