import { type Account, type Address, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import type { GetDnsImportDataReturnType } from './getDnsImportData.js';
type BaseImportDnsNameDataParameters = {
    /** Name to import */
    name: string;
    /** Data returned from `getDnsImportData()` */
    dnsImportData: GetDnsImportDataReturnType;
    /** Address to claim the name for */
    address?: Address;
    /** Address of the resolver to use (default: `ensPublicResolver`) */
    resolverAddress?: Address;
};
type NoResolverImportDnsNameDataParameters = {
    address?: never;
    resolverAddress?: never;
};
type ResolverImportDnsNameDataParameters = {
    address: Address;
    resolverAddress?: Address;
};
export type ImportDnsNameDataParameters = BaseImportDnsNameDataParameters & (NoResolverImportDnsNameDataParameters | ResolverImportDnsNameDataParameters);
export type ImportDnsNameDataReturnType = SimpleTransactionRequest;
export type ImportDnsNameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<ImportDnsNameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type ImportDnsNameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, dnsImportData, address, resolverAddress, }: ImportDnsNameDataParameters) => ImportDnsNameDataReturnType;
/**
 * Creates a transaction to import a DNS name to ENS.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link ImportDnsNameParameters}
 * @returns A transaction hash. {@link ImportDnsNameReturnType}
 *
 * @example
 * import { createPublicClient, createWalletClient, http, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getDnsImportData, importDnsName } from '@ensdomains/ensjs/dns'
 *
 * const mainnetWithEns = addEnsContracts(mainnet)
 * const client = createPublicClient({
 *   chain: mainnetWithEns,
 *   transport: http(),
 * })
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 * const dnsImportData = await getDnsImportData(client, {
 *   name: 'example.com',
 * })
 * const hash = await importDnsName(wallet, {
 *   name: 'example.com',
 *   dnsImportData,
 * })
 */
declare function importDnsName<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, address, dnsImportData, resolverAddress, ...txArgs }: ImportDnsNameParameters<TChain, TAccount, TChainOverride>): Promise<ImportDnsNameReturnType>;
declare namespace importDnsName {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, dnsImportData, address, resolverAddress, }: ImportDnsNameDataParameters) => SimpleTransactionRequest;
}
export default importDnsName;
//# sourceMappingURL=importDnsName.d.ts.map