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
    ccipRead?: false | {
        request?: ((parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain: TChain;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<import("viem").WalletRpcSchema>;
    transport: ReturnType<TTransport>["config"] & ReturnType<TTransport>["value"];
    type: string;
    uid: string;
    addChain: (args: import("viem").AddChainParameters) => Promise<void>;
    deployContract: <const abi extends import("viem").Abi | readonly unknown[], chainOverride extends import("viem").Chain | undefined>(args: import("viem").DeployContractParameters<abi, TChain, TAccount, chainOverride>) => Promise<`0x${string}`>;
    getAddresses: () => Promise<import("viem").GetAddressesReturnType>;
    getChainId: () => Promise<number>;
    getPermissions: () => Promise<import("viem").GetPermissionsReturnType>;
    prepareTransactionRequest: <const request extends import("viem").PrepareTransactionRequestRequest<TChain, chainOverride_1>, chainOverride_1 extends import("viem").Chain | undefined = undefined, accountOverride extends `0x${string}` | Account | undefined = undefined>(args: import("viem").PrepareTransactionRequestParameters<TChain, TAccount, chainOverride_1, accountOverride, request>) => Promise<import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<TChain, chainOverride_1>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<TChain, chainOverride_1> extends infer T_14 ? T_14 extends import("viem").DeriveChain<TChain, chainOverride_1> ? T_14 extends import("viem").Chain ? {
        chain: T_14;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<TAccount, accountOverride> extends infer T_15 ? T_15 extends import("viem").DeriveAccount<TAccount, accountOverride> ? T_15 extends Account ? {
        account: T_15;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_16 ? T_16 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_16 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_17 ? T_17 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_17 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_18 ? T_18 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_18 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_19 ? T_19 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_19 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_20 ? T_20 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_20 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_21 ? T_21 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_21 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_22 ? T_22 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_22 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_23 ? T_23 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_23 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_24 ? T_24 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_24 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_25 ? T_25 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_25 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") extends infer T_26 ? T_26 extends (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") ? T_26 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_26 : never : never> & (unknown extends request["kzg"] ? {} : Pick<request, "kzg">) extends infer T ? { [K in keyof T]: (import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<TChain, chainOverride_1>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<TChain, chainOverride_1> extends infer T_1 ? T_1 extends import("viem").DeriveChain<TChain, chainOverride_1> ? T_1 extends import("viem").Chain ? {
        chain: T_1;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<TAccount, accountOverride> extends infer T_2 ? T_2 extends import("viem").DeriveAccount<TAccount, accountOverride> ? T_2 extends Account ? {
        account: T_2;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_3 ? T_3 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_3 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_4 ? T_4 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_4 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_5 ? T_5 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_5 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_6 ? T_6 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_6 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_7 ? T_7 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_7 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_8 ? T_8 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_8 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_9 ? T_9 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_9 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_10 ? T_10 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_10 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_11 ? T_11 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_11 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_12 ? T_12 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_12 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") extends infer T_13 ? T_13 extends (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") ? T_13 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_13 : never : never> & (unknown extends request["kzg"] ? {} : Pick<request, "kzg">))[K]; } : never>;
    requestAddresses: () => Promise<import("viem").RequestAddressesReturnType>;
    requestPermissions: (args: {
        [x: string]: Record<string, any>;
        eth_accounts: Record<string, any>;
    }) => Promise<import("viem").RequestPermissionsReturnType>;
    sendRawTransaction: (args: import("viem").SendRawTransactionParameters) => Promise<`0x${string}`>;
    sendTransaction: <const request_1 extends import("viem").SendTransactionRequest<TChain, chainOverride_2>, chainOverride_2 extends import("viem").Chain | undefined = undefined>(args: import("viem").SendTransactionParameters<TChain, TAccount, chainOverride_2, request_1>) => Promise<`0x${string}`>;
    signMessage: (args: import("viem").SignMessageParameters<TAccount>) => Promise<`0x${string}`>;
    signTransaction: <chainOverride_3 extends import("viem").Chain | undefined>(args: import("viem").SignTransactionParameters<TChain, TAccount, chainOverride_3>) => Promise<`0x02${string}` | `0x01${string}` | `0x03${string}` | `0x04${string}` | import("viem").TransactionSerializedLegacy>;
    signTypedData: <const typedData extends {
        [x: string]: readonly import("viem").TypedDataParameter[];
        [x: `string[${string}]`]: undefined;
        [x: `function[${string}]`]: undefined;
        [x: `address[${string}]`]: undefined;
        [x: `bytes[${string}]`]: undefined;
        [x: `uint32[${string}]`]: undefined;
        [x: `bool[${string}]`]: undefined;
        [x: `bytes1[${string}]`]: undefined;
        [x: `bytes2[${string}]`]: undefined;
        [x: `bytes4[${string}]`]: undefined;
        [x: `bytes8[${string}]`]: undefined;
        [x: `bytes5[${string}]`]: undefined;
        [x: `bytes12[${string}]`]: undefined;
        [x: `bytes22[${string}]`]: undefined;
        [x: `bytes6[${string}]`]: undefined;
        [x: `bytes3[${string}]`]: undefined;
        [x: `bytes7[${string}]`]: undefined;
        [x: `bytes9[${string}]`]: undefined;
        [x: `bytes10[${string}]`]: undefined;
        [x: `bytes11[${string}]`]: undefined;
        [x: `bytes13[${string}]`]: undefined;
        [x: `bytes14[${string}]`]: undefined;
        [x: `bytes15[${string}]`]: undefined;
        [x: `bytes16[${string}]`]: undefined;
        [x: `bytes17[${string}]`]: undefined;
        [x: `bytes18[${string}]`]: undefined;
        [x: `bytes19[${string}]`]: undefined;
        [x: `bytes20[${string}]`]: undefined;
        [x: `bytes21[${string}]`]: undefined;
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
        [x: `int8[${string}]`]: undefined;
        [x: `int40[${string}]`]: undefined;
        [x: `int16[${string}]`]: undefined;
        [x: `int24[${string}]`]: undefined;
        [x: `int32[${string}]`]: undefined;
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
        [x: `uint8[${string}]`]: undefined;
        [x: `uint40[${string}]`]: undefined;
        [x: `uint16[${string}]`]: undefined;
        [x: `uint24[${string}]`]: undefined;
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
        bytes?: undefined;
        uint32?: undefined;
        bool?: undefined;
        bytes1?: undefined;
        bytes2?: undefined;
        bytes4?: undefined;
        bytes8?: undefined;
        bytes5?: undefined;
        bytes12?: undefined;
        bytes22?: undefined;
        bytes6?: undefined;
        bytes3?: undefined;
        bytes7?: undefined;
        bytes9?: undefined;
        bytes10?: undefined;
        bytes11?: undefined;
        bytes13?: undefined;
        bytes14?: undefined;
        bytes15?: undefined;
        bytes16?: undefined;
        bytes17?: undefined;
        bytes18?: undefined;
        bytes19?: undefined;
        bytes20?: undefined;
        bytes21?: undefined;
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
        int8?: undefined;
        int40?: undefined;
        int16?: undefined;
        int24?: undefined;
        int32?: undefined;
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
        uint8?: undefined;
        uint40?: undefined;
        uint16?: undefined;
        uint24?: undefined;
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
    } | {
        [key: string]: unknown;
    }, primaryType extends string>(args: import("viem").SignTypedDataParameters<typedData, primaryType, TAccount>) => Promise<`0x${string}`>;
    switchChain: (args: import("viem").SwitchChainParameters) => Promise<void>;
    watchAsset: (args: import("viem").WatchAssetParams) => Promise<boolean>;
    writeContract: <const abi_1 extends import("viem").Abi | readonly unknown[], functionName extends import("viem").ContractFunctionName<abi_1, "payable" | "nonpayable">, args extends import("viem").ContractFunctionArgs<abi_1, "payable" | "nonpayable", functionName>, chainOverride_4 extends import("viem").Chain | undefined = undefined>(args: import("viem").WriteContractParameters<abi_1, functionName, args, TChain, TAccount, chainOverride_4>) => Promise<`0x${string}`>;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & import("viem").ExactPartial<Pick<import("viem").PublicActions<TTransport, TChain, TAccount>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<import("viem").WalletActions<TChain, TAccount>, "sendTransaction" | "writeContract">>>(fn: (client: import("viem").Client<TTransport, TChain, TAccount, import("viem").WalletRpcSchema, import("viem").WalletActions<TChain, TAccount>>) => client) => import("viem").Client<TTransport, TChain, TAccount, import("viem").WalletRpcSchema, { [K_11 in keyof client]: client[K_11]; } & import("viem").WalletActions<TChain, TAccount>>;
}) => EnsWalletActions<TChain, TAccount>;
//# sourceMappingURL=wallet.d.ts.map