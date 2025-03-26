import type { Account, Address, Hash, Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
export type SetContentHashRecordDataParameters = {
    /** Name to set content hash for */
    name: string;
    /** Content hash value */
    contentHash: string | null;
    /** Resolver address to set content hash on */
    resolverAddress: Address;
};
export type SetContentHashRecordDataReturnType = SimpleTransactionRequest;
export type SetContentHashRecordParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<SetContentHashRecordDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type SetContentHashRecordReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(_wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contentHash, resolverAddress }: SetContentHashRecordDataParameters) => SetContentHashRecordDataReturnType;
/**
 * Sets the content hash record for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetContentHashRecordParameters}
 * @returns Transaction hash. {@link SetContentHashRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setContentHashRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setContentHashRecord(wallet, {
 *   name: 'ens.eth',
 *   value: 'ipns://k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
declare function setContentHashRecord<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contentHash, resolverAddress, ...txArgs }: SetContentHashRecordParameters<TChain, TAccount, TChainOverride>): Promise<SetContentHashRecordReturnType>;
declare namespace setContentHashRecord {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(_wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, contentHash, resolverAddress }: SetContentHashRecordDataParameters) => SimpleTransactionRequest;
}
export default setContentHashRecord;
//# sourceMappingURL=setContentHashRecord.d.ts.map