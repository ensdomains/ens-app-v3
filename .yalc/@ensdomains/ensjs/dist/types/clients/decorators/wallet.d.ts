import type { Account, Transport, WalletClient } from 'viem';
import type { ChainWithEns } from '../../contracts/consts.js';
import { type ClearRecordsParameters, type ClearRecordsReturnType } from '../../functions/wallet/clearRecords.js';
import { type CommitNameParameters, type CommitNameReturnType } from '../../functions/wallet/commitName.js';
import { type CreateSubnameParameters, type CreateSubnameReturnType } from '../../functions/wallet/createSubname.js';
import { type DeleteSubnameParameters, type DeleteSubnameReturnType } from '../../functions/wallet/deleteSubname.js';
import { type RegisterNameParameters, type RegisterNameReturnType } from '../../functions/wallet/registerName.js';
import { type RenewNamesParameters, type RenewNamesReturnType } from '../../functions/wallet/renewNames.js';
import { type SetAbiRecordParameters, type SetAbiRecordReturnType } from '../../functions/wallet/setAbiRecord.js';
import { type SetAddressRecordParameters, type SetAddressRecordReturnType } from '../../functions/wallet/setAddressRecord.js';
import { type SetChildFusesParameters, type SetChildFusesReturnType } from '../../functions/wallet/setChildFuses.js';
import { type SetContentHashRecordParameters, type SetContentHashRecordReturnType } from '../../functions/wallet/setContentHashRecord.js';
import { type SetFusesParameters, type SetFusesReturnType } from '../../functions/wallet/setFuses.js';
import { type SetPrimaryNameParameters, type SetPrimaryNameReturnType } from '../../functions/wallet/setPrimaryName.js';
import { type SetRecordsParameters, type SetRecordsReturnType } from '../../functions/wallet/setRecords.js';
import { type SetResolverParameters, type SetResolverReturnType } from '../../functions/wallet/setResolver.js';
import { type SetTextRecordParameters, type SetTextRecordReturnType } from '../../functions/wallet/setTextRecord.js';
import { type TransferNameParameters, type TransferNameReturnType } from '../../functions/wallet/transferName.js';
import { type UnwrapNameParameters, type UnwrapNameReturnType } from '../../functions/wallet/unwrapName.js';
import { type WrapNameParameters, type WrapNameReturnType } from '../../functions/wallet/wrapName.js';
export type EnsWalletActions<TChain extends ChainWithEns, TAccount extends Account | undefined> = {
    /**
     * Clears the records for a name on a resolver.
     * @param parameters - {@link ClearRecordsParameters}
     * @returns Transaction hash. {@link ClearRecordsReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.clearRecords({
     *   name: 'ens.eth',
     *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
     * })
     * // 0x...
     */
    clearRecords: ({ name, resolverAddress, ...txArgs }: ClearRecordsParameters<TChain, TAccount, TChain>) => Promise<ClearRecordsReturnType>;
    /**
     * Commits a name to be registered
     * @param parameters - {@link CommitNameParameters}
     * @returns Transaction hash. {@link CommitNameReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     * import { randomSecret } from '@ensdomains/ensjs/utils'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const secret = randomSecret()
     * const hash = await wallet.commitName({
     *   name: 'example.eth',
     *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     *   duration: 31536000, // 1 year
     *   secret,
     * })
     * // 0x...
     */
    commitName: ({ name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, ...txArgs }: CommitNameParameters<TChain, TAccount, TChain>) => Promise<CommitNameReturnType>;
    /**
     * Creates a subname
     * @param parameters - {@link CreateSubnameParameters}
     * @returns Transaction hash. {@link CreateSubnameReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.createSubname({
     *   name: 'sub.ens.eth',
     *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     *   contract: 'registry',
     * })
     * // 0x...
     */
    createSubname: ({ name, contract, owner, resolverAddress, expiry, fuses, ...txArgs }: CreateSubnameParameters<TChain, TAccount, TChain>) => Promise<CreateSubnameReturnType>;
    /**
     * Deletes a subname
     * @param parameters - {@link DeleteSubnameParameters}
     * @returns Transaction hash. {@link DeleteSubnameReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.deleteSubname({
     *   name: 'sub.ens.eth',
     *   contract: 'registry',
     * })
     * // 0x...
     */
    deleteSubname: ({ name, contract, asOwner, ...txArgs }: DeleteSubnameParameters<TChain, TAccount, TChain>) => Promise<DeleteSubnameReturnType>;
    /**
     * Registers a name on ENS
     * @param parameters - {@link RegisterNameParameters}
     * @returns Transaction hash. {@link RegisterNameReturnType}
     *
     * @example
     * import { createPublicClient, createWalletClient, http, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensPublicActions, ensWalletActions } from '@ensdomains/ensjs'
     * import { randomSecret } from '@ensdomains/ensjs/utils'
     *
     * const mainnetWithEns = addEnsContracts(mainnet)
     * const client = createPublicClient({
     *   chain: mainnetWithEns,
     *   transport: http(),
     * }).extend(ensPublicActions)
     * const wallet = createWalletClient({
     *   chain: mainnetWithEns,
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const secret = randomSecret()
     * const params = {
     *   name: 'example.eth',
     *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     *   duration: 31536000, // 1 year
     *   secret,
     * }
     *
     * const commitmentHash = await wallet.commitName(params)
     * await client.waitForTransactionReceipt({ hash: commitmentHash }) // wait for commitment to finalise
     * await new Promise((resolve) => setTimeout(resolve, 60 * 1_000)) // wait for commitment to be valid
     *
     * const { base, premium } = await client.getPrice({ nameOrNames: params.name, duration: params.duration })
     * const value = (base + premium) * 110n / 100n // add 10% to the price for buffer
     * const hash = await wallet.registerName({ ...params, value })
     * // 0x...
     */
    registerName: ({ name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, value, ...txArgs }: RegisterNameParameters<TChain, TAccount, TChain>) => Promise<RegisterNameReturnType>;
    /**
     * Renews a name or names for a specified duration.
     * @param parameters - {@link RenewNamesParameters}
     * @returns Transaction hash. {@link RenewNamesReturnType}
     *
     * @example
     * import { createPublicClient, createWalletClient, http, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensPublicActions, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const mainnetWithEns = addEnsContracts(mainnet)
     * const client = createPublicClient({
     *   chain: mainnetWithEns,
     *   transport: http(),
     * }).extend(ensPublicActions)
     * const wallet = createWalletClient({
     *   chain: mainnetWithEns,
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     *
     * const duration = 31536000 // 1 year
     * const { base, premium } = await client.getPrice({
     *  nameOrNames: 'example.eth',
     *  duration,
     * })
     * const value = (base + premium) * 110n / 100n // add 10% to the price for buffer
     * const hash = await wallet.renewNames({
     *   nameOrNames: 'example.eth',
     *   duration,
     *   value,
     * })
     * // 0x...
     */
    renewNames: ({ nameOrNames, duration, value, ...txArgs }: RenewNamesParameters<TChain, TAccount, TChain>) => Promise<RenewNamesReturnType>;
    /**
     * Sets the ABI for a name on a resolver.
     * @param parameters - {@link SetAbiRecordParameters}
     * @returns Transaction hash. {@link SetAbiRecordReturnType}
     *
     * @example
     * import abi from './abi.json'
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     * import { encodeAbi } from '@ensdomains/ensjs/utils'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     *
     * const encodedAbi = await encodeAbi({ encodeAs: 'json', abi })
     * const hash = await wallet.setAbiRecord({
     *   name: 'ens.eth',
     *   encodedAbi,
     *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
     * })
     * // 0x...
     */
    setAbiRecord: ({ name, encodedAbi, resolverAddress, ...txArgs }: SetAbiRecordParameters<TChain, TAccount, TChain>) => Promise<SetAbiRecordReturnType>;
    /**
     * Sets an address record for a name on a resolver.
     * @param parameters - {@link SetAddressRecordParameters}
     * @returns Transaction hash. {@link SetAddressRecordReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setAddressRecord({
     *   name: 'ens.eth',
     *   coin: 'ETH',
     *   value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
     * })
     * // 0x...
     */
    setAddressRecord: ({ name, coin, value, resolverAddress, ...txArgs }: SetAddressRecordParameters<TChain, TAccount, TChain>) => Promise<SetAddressRecordReturnType>;
    /**
     * Sets the fuses for a name as the parent.
     * @param parameters - {@link SetChildFusesParameters}
     * @returns Transaction hash. {@link SetChildFusesReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setChildFuses({
     *   name: 'sub.ens.eth',
     *   fuses: {
     *     parent: {
     *       named: ['PARENT_CANNOT_CONTROl'],
     *     },
     *   },
     * })
     * // 0x...
     */
    setChildFuses: ({ name, fuses, expiry, ...txArgs }: SetChildFusesParameters<TChain, TAccount, TChain>) => Promise<SetChildFusesReturnType>;
    /**
     * Sets the content hash record for a name on a resolver.
     * @param parameters - {@link SetContentHashRecordParameters}
     * @returns Transaction hash. {@link SetContentHashRecordReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setContentHashRecord({
     *   name: 'ens.eth',
     *   value: 'ipns://k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw',
     *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
     * })
     * // 0x...
     */
    setContentHashRecord: ({ name, contentHash, resolverAddress, ...txArgs }: SetContentHashRecordParameters<TChain, TAccount, TChain>) => Promise<SetContentHashRecordReturnType>;
    /**
     * Sets the fuses for a name.
     * @param parameters - {@link SetFusesParameters}
     * @returns Transaction hash. {@link SetFusesReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setFuses({
     *   name: 'sub.ens.eth',
     *   fuses: {
     *     named: ['CANNOT_TRANSFER'],
     *   },
     * })
     * // 0x...
     */
    setFuses: ({ name, fuses, ...txArgs }: SetFusesParameters<TChain, TAccount, TChain>) => Promise<SetFusesReturnType>;
    /**
     * Sets a primary name for an address.
     * @param parameters - {@link SetPrimaryNameParameters}
     * @returns Transaction hash. {@link SetPrimaryNameReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setPrimaryName({
     *   name: 'ens.eth',
     * })
     * // 0x...
     */
    setPrimaryName: ({ name, address, resolverAddress, ...txArgs }: SetPrimaryNameParameters<TChain, TAccount, TChain>) => Promise<SetPrimaryNameReturnType>;
    /**
     * Sets multiple records for a name on a resolver.
     * @param parameters - {@link SetRecordsParameters}
     * @returns Transaction hash. {@link SetRecordsReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setRecords({
     *   name: 'ens.eth',
     *   coins: [
     *     {
     *       coin: 'ETH',
     *       value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     *     },
     *   ],
     *   texts: [{ key: 'foo', value: 'bar' }],
     *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
     * })
     * // 0x...
     */
    setRecords: ({ name, resolverAddress, clearRecords, contentHash, texts, coins, abi, ...txArgs }: SetRecordsParameters<TChain, TAccount, TChain>) => Promise<SetRecordsReturnType>;
    /**
     * Sets a resolver for a name.
     * @param parameters - {@link SetResolverParameters}
     * @returns Transaction hash. {@link SetResolverReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setResolver({
     *   name: 'ens.eth',
     *   contract: 'registry',
     *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
     * })
     * // 0x...
     */
    setResolver: ({ name, contract, resolverAddress, ...txArgs }: SetResolverParameters<TChain, TAccount, TChain>) => Promise<SetResolverReturnType>;
    /**
     * Sets a text record for a name on a resolver.
     * @param parameters - {@link SetTextRecordParameters}
     * @returns Transaction hash. {@link SetTextRecordReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.setTextRecord({
     *   name: 'ens.eth',
     *   key: 'foo',
     *   value: 'bar',
     *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
     * })
     * // 0x...
     */
    setTextRecord: ({ name, key, value, resolverAddress, ...txArgs }: SetTextRecordParameters<TChain, TAccount, TChain>) => Promise<SetTextRecordReturnType>;
    /**
     * Transfers a name to a new owner.
     * @param parameters - {@link TransferNameParameters}
     * @returns Transaction hash. {@link TransferNameReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.transferName({
     *   name: 'ens.eth',
     *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     *   contract: 'registry',
     * })
     * // 0x...
     */
    transferName: ({ name, newOwnerAddress, contract, reclaim, asParent, ...txArgs }: TransferNameParameters<TChain, TAccount, TChain>) => Promise<TransferNameReturnType>;
    /**
     * Unwraps a name.
     * @param parameters - {@link UnwrapNameParameters}
     * @returns Transaction hash. {@link UnwrapNameReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.unwrapName({
     *   name: 'example.eth',
     *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     *   newRegistrantAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     * })
     * // 0x...
     */
    unwrapName: <TName extends string>({ name, newOwnerAddress, newRegistrantAddress, ...txArgs }: UnwrapNameParameters<TName, TChain, TAccount, TChain>) => Promise<UnwrapNameReturnType>;
    /**
     * Wraps a name.
     * @param parameters - {@link WrapNameParameters}
     * @returns Transaction hash. {@link WrapNameReturnType}
     *
     * @example
     * import { createWalletClient, custom } from 'viem'
     * import { mainnet } from 'viem/chains'
     * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
     *
     * const wallet = createWalletClient({
     *   chain: addEnsContracts(mainnet),
     *   transport: custom(window.ethereum),
     * }).extend(ensWalletActions)
     * const hash = await wallet.wrapName({
     *   name: 'ens.eth',
     *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
     * })
     * // 0x...
     */
    wrapName: <TName extends string>({ name, newOwnerAddress, fuses, resolverAddress, ...txArgs }: WrapNameParameters<TName, TChain, TAccount, TChain>) => Promise<WrapNameReturnType>;
};
/**
 * Extends the viem client with ENS wallet actions
 * @param client - The viem {@link WalletClient} object to add the ENS wallet actions to
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * }).extend(ensWalletActions)
 */
export declare const ensWalletActions: <TTransport extends Transport = Transport, TChain extends ChainWithEns = ChainWithEns, TAccount extends Account | undefined = Account | undefined>(client: {
    account: TAccount;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    chain: TChain;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<import("viem").WalletRpcSchema>;
    transport: ReturnType<TTransport>["config"] & ReturnType<TTransport>["value"];
    type: string;
    uid: string;
    addChain: (args: import("viem").AddChainParameters) => Promise<void>;
    deployContract: <const TAbi extends import("viem").Abi | readonly unknown[], TChainOverride extends import("viem").Chain | undefined>(args: import("viem").DeployContractParameters<TAbi, TChain, TAccount, TChainOverride>) => Promise<`0x${string}`>;
    getAddresses: () => Promise<import("viem").GetAddressesReturnType>;
    getChainId: () => Promise<number>;
    getPermissions: () => Promise<import("viem").GetPermissionsReturnType>;
    prepareTransactionRequest: <TChainOverride_1 extends import("viem").Chain | undefined>(args: import("viem").PrepareTransactionRequestParameters<TChain, TAccount, TChainOverride_1>) => Promise<import("viem").PrepareTransactionRequestReturnType>;
    requestAddresses: () => Promise<import("viem").RequestAddressesReturnType>;
    requestPermissions: (args: {
        [x: string]: Record<string, any>;
        eth_accounts: Record<string, any>;
    }) => Promise<import("viem").RequestPermissionsReturnType>;
    sendRawTransaction: (args: import("viem/actions").SendRawTransactionParameters) => Promise<`0x${string}`>;
    sendTransaction: <TChainOverride_2 extends import("viem").Chain | undefined>(args: import("viem").SendTransactionParameters<TChain, TAccount, TChainOverride_2>) => Promise<`0x${string}`>;
    signMessage: (args: import("viem").SignMessageParameters<TAccount>) => Promise<`0x${string}`>;
    signTransaction: <TChainOverride_3 extends import("viem").Chain | undefined>(args: import("viem/actions").SignTransactionParameters<TChain, TAccount, TChainOverride_3>) => Promise<`0x${string}`>;
    signTypedData: <const TTypedData extends {
        [key: string]: unknown;
    } | {
        [x: string]: readonly import("viem").TypedDataParameter[];
        [x: `string[${string}]`]: undefined;
        [x: `function[${string}]`]: undefined;
        [x: `address[${string}]`]: undefined;
        [x: `bool[${string}]`]: undefined;
        [x: `bytes[${string}]`]: undefined;
        [x: `bytes3[${string}]`]: undefined;
        [x: `bytes10[${string}]`]: undefined;
        [x: `bytes16[${string}]`]: undefined;
        [x: `bytes1[${string}]`]: undefined;
        [x: `bytes2[${string}]`]: undefined;
        [x: `bytes4[${string}]`]: undefined;
        [x: `bytes5[${string}]`]: undefined;
        [x: `bytes6[${string}]`]: undefined;
        [x: `bytes7[${string}]`]: undefined;
        [x: `bytes8[${string}]`]: undefined;
        [x: `bytes9[${string}]`]: undefined;
        [x: `bytes11[${string}]`]: undefined;
        [x: `bytes12[${string}]`]: undefined;
        [x: `bytes13[${string}]`]: undefined;
        [x: `bytes14[${string}]`]: undefined;
        [x: `bytes15[${string}]`]: undefined;
        [x: `bytes17[${string}]`]: undefined;
        [x: `bytes18[${string}]`]: undefined;
        [x: `bytes19[${string}]`]: undefined;
        [x: `bytes20[${string}]`]: undefined;
        [x: `bytes21[${string}]`]: undefined;
        [x: `bytes22[${string}]`]: undefined;
        [x: `bytes23[${string}]`]: undefined;
        [x: `bytes24[${string}]`]: undefined;
        [x: `bytes25[${string}]`]: undefined;
        [x: `bytes26[${string}]`]: undefined;
        [x: `bytes27[${string}]`]: undefined;
        [x: `bytes28[${string}]`]: undefined;
        [x: `bytes29[${string}]`]: undefined;
        [x: `bytes30[${string}]`]: undefined;
        [x: `bytes31[${string}]`]: undefined;
        [x: `bytes32[${string}]`]: undefined;
        [x: `int[${string}]`]: undefined;
        [x: `int16[${string}]`]: undefined;
        [x: `int8[${string}]`]: undefined;
        [x: `int24[${string}]`]: undefined;
        [x: `int32[${string}]`]: undefined;
        [x: `int40[${string}]`]: undefined;
        [x: `int48[${string}]`]: undefined;
        [x: `int56[${string}]`]: undefined;
        [x: `int64[${string}]`]: undefined;
        [x: `int72[${string}]`]: undefined;
        [x: `int80[${string}]`]: undefined;
        [x: `int88[${string}]`]: undefined;
        [x: `int96[${string}]`]: undefined;
        [x: `int104[${string}]`]: undefined;
        [x: `int112[${string}]`]: undefined;
        [x: `int120[${string}]`]: undefined;
        [x: `int128[${string}]`]: undefined;
        [x: `int136[${string}]`]: undefined;
        [x: `int144[${string}]`]: undefined;
        [x: `int152[${string}]`]: undefined;
        [x: `int160[${string}]`]: undefined;
        [x: `int168[${string}]`]: undefined;
        [x: `int176[${string}]`]: undefined;
        [x: `int184[${string}]`]: undefined;
        [x: `int192[${string}]`]: undefined;
        [x: `int200[${string}]`]: undefined;
        [x: `int208[${string}]`]: undefined;
        [x: `int216[${string}]`]: undefined;
        [x: `int224[${string}]`]: undefined;
        [x: `int232[${string}]`]: undefined;
        [x: `int240[${string}]`]: undefined;
        [x: `int248[${string}]`]: undefined;
        [x: `int256[${string}]`]: undefined;
        [x: `uint[${string}]`]: undefined;
        [x: `uint16[${string}]`]: undefined;
        [x: `uint8[${string}]`]: undefined;
        [x: `uint24[${string}]`]: undefined;
        [x: `uint32[${string}]`]: undefined;
        [x: `uint40[${string}]`]: undefined;
        [x: `uint48[${string}]`]: undefined;
        [x: `uint56[${string}]`]: undefined;
        [x: `uint64[${string}]`]: undefined;
        [x: `uint72[${string}]`]: undefined;
        [x: `uint80[${string}]`]: undefined;
        [x: `uint88[${string}]`]: undefined;
        [x: `uint96[${string}]`]: undefined;
        [x: `uint104[${string}]`]: undefined;
        [x: `uint112[${string}]`]: undefined;
        [x: `uint120[${string}]`]: undefined;
        [x: `uint128[${string}]`]: undefined;
        [x: `uint136[${string}]`]: undefined;
        [x: `uint144[${string}]`]: undefined;
        [x: `uint152[${string}]`]: undefined;
        [x: `uint160[${string}]`]: undefined;
        [x: `uint168[${string}]`]: undefined;
        [x: `uint176[${string}]`]: undefined;
        [x: `uint184[${string}]`]: undefined;
        [x: `uint192[${string}]`]: undefined;
        [x: `uint200[${string}]`]: undefined;
        [x: `uint208[${string}]`]: undefined;
        [x: `uint216[${string}]`]: undefined;
        [x: `uint224[${string}]`]: undefined;
        [x: `uint232[${string}]`]: undefined;
        [x: `uint240[${string}]`]: undefined;
        [x: `uint248[${string}]`]: undefined;
        [x: `uint256[${string}]`]: undefined;
        string?: undefined;
        address?: undefined;
        bool?: undefined;
        bytes?: undefined;
        bytes3?: undefined;
        bytes10?: undefined;
        bytes16?: undefined;
        bytes1?: undefined;
        bytes2?: undefined;
        bytes4?: undefined;
        bytes5?: undefined;
        bytes6?: undefined;
        bytes7?: undefined;
        bytes8?: undefined;
        bytes9?: undefined;
        bytes11?: undefined;
        bytes12?: undefined;
        bytes13?: undefined;
        bytes14?: undefined;
        bytes15?: undefined;
        bytes17?: undefined;
        bytes18?: undefined;
        bytes19?: undefined;
        bytes20?: undefined;
        bytes21?: undefined;
        bytes22?: undefined;
        bytes23?: undefined;
        bytes24?: undefined;
        bytes25?: undefined;
        bytes26?: undefined;
        bytes27?: undefined;
        bytes28?: undefined;
        bytes29?: undefined;
        bytes30?: undefined;
        bytes31?: undefined;
        bytes32?: undefined;
        int16?: undefined;
        int8?: undefined;
        int24?: undefined;
        int32?: undefined;
        int40?: undefined;
        int48?: undefined;
        int56?: undefined;
        int64?: undefined;
        int72?: undefined;
        int80?: undefined;
        int88?: undefined;
        int96?: undefined;
        int104?: undefined;
        int112?: undefined;
        int120?: undefined;
        int128?: undefined;
        int136?: undefined;
        int144?: undefined;
        int152?: undefined;
        int160?: undefined;
        int168?: undefined;
        int176?: undefined;
        int184?: undefined;
        int192?: undefined;
        int200?: undefined;
        int208?: undefined;
        int216?: undefined;
        int224?: undefined;
        int232?: undefined;
        int240?: undefined;
        int248?: undefined;
        int256?: undefined;
        uint16?: undefined;
        uint8?: undefined;
        uint24?: undefined;
        uint32?: undefined;
        uint40?: undefined;
        uint48?: undefined;
        uint56?: undefined;
        uint64?: undefined;
        uint72?: undefined;
        uint80?: undefined;
        uint88?: undefined;
        uint96?: undefined;
        uint104?: undefined;
        uint112?: undefined;
        uint120?: undefined;
        uint128?: undefined;
        uint136?: undefined;
        uint144?: undefined;
        uint152?: undefined;
        uint160?: undefined;
        uint168?: undefined;
        uint176?: undefined;
        uint184?: undefined;
        uint192?: undefined;
        uint200?: undefined;
        uint208?: undefined;
        uint216?: undefined;
        uint224?: undefined;
        uint232?: undefined;
        uint240?: undefined;
        uint248?: undefined;
        uint256?: undefined;
    }, TPrimaryType extends string>(args: import("viem").SignTypedDataParameters<TTypedData, TPrimaryType, TAccount>) => Promise<`0x${string}`>;
    switchChain: (args: import("viem").SwitchChainParameters) => Promise<void>;
    watchAsset: (args: import("viem").WatchAssetParams) => Promise<boolean>;
    writeContract: <const TAbi_1 extends import("viem").Abi | readonly unknown[], TFunctionName extends string, TChainOverride_4 extends import("viem").Chain | undefined>(args: import("viem").WriteContractParameters<TAbi_1, TFunctionName, TChain, TAccount, TChainOverride_4>) => Promise<`0x${string}`>;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    }>(fn: (client: import("viem").Client<TTransport, TChain, TAccount, import("viem").WalletRpcSchema, import("viem").WalletActions<TChain, TAccount>>) => client) => import("viem").Client<TTransport, TChain, TAccount, import("viem").WalletRpcSchema, { [K in keyof client]: client[K]; } & import("viem").WalletActions<TChain, TAccount>>;
}) => EnsWalletActions<TChain, TAccount>;
//# sourceMappingURL=wallet.d.ts.map