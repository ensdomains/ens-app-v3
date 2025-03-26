import type { Account, Client, Transport } from 'viem'
import type { ChainWithEns } from '../../contracts/consts.js'
import batch, {
  type BatchParameters,
  type BatchReturnType,
} from '../../functions/public/batch.js'
import getAbiRecord, {
  type GetAbiRecordParameters,
  type GetAbiRecordReturnType,
} from '../../functions/public/getAbiRecord.js'
import getAddressRecord, {
  type GetAddressRecordParameters,
  type GetAddressRecordReturnType,
} from '../../functions/public/getAddressRecord.js'
import getAvailable, {
  type GetAvailableParameters,
  type GetAvailableReturnType,
} from '../../functions/public/getAvailable.js'
import getContentHashRecord, {
  type GetContentHashRecordParameters,
  type GetContentHashRecordReturnType,
} from '../../functions/public/getContentHashRecord.js'
import getExpiry, {
  type GetExpiryParameters,
  type GetExpiryReturnType,
} from '../../functions/public/getExpiry.js'
import getName, {
  type GetNameParameters,
  type GetNameReturnType,
} from '../../functions/public/getName.js'
import getOwner, {
  type GetOwnerParameters,
  type GetOwnerReturnType,
} from '../../functions/public/getOwner.js'
import getPrice, {
  type GetPriceParameters,
  type GetPriceReturnType,
} from '../../functions/public/getPrice.js'
import getRecords, {
  type GetRecordsParameters,
  type GetRecordsReturnType,
} from '../../functions/public/getRecords.js'
import getResolver, {
  type GetResolverParameters,
  type GetResolverReturnType,
} from '../../functions/public/getResolver.js'
import getTextRecord, {
  type GetTextRecordParameters,
  type GetTextRecordReturnType,
} from '../../functions/public/getTextRecord.js'
import getWrapperData, {
  type GetWrapperDataParameters,
  type GetWrapperDataReturnType,
} from '../../functions/public/getWrapperData.js'
import getWrapperName, {
  type GetWrapperNameParameters,
  type GetWrapperNameReturnType,
} from '../../functions/public/getWrapperName.js'

export type EnsPublicActions = {
  /**
   * Batches multiple read functions into a single call.
   * @param ...parameters - Array of {@link BatchFunctionResult} objects
   * @returns Array of return values from each function
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions, getTextRecord, getAddressRecord } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.ensBatch(
   *   getTextRecord.batch({ name: 'ens.eth', key: 'com.twitter' }),
   *   getAddressRecord.batch({ name: 'ens.eth', coin: 'ETH' }),
   * )
   * // ['ensdomains', { id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7 }]
   */
  ensBatch: <TBatchFunctions extends BatchParameters>(
    ...parameters: TBatchFunctions
  ) => Promise<BatchReturnType<TBatchFunctions>>
  /**
   * Gets the ABI record for a name
   * @param parameters - {@link GetAbiRecordParameters}
   * @returns ABI record for the name, or `null` if not found. {@link GetAbiRecordReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getAbiRecord({ name: 'ens.eth' })
   * // TODO: real example
   */
  getAbiRecord: ({
    name,
    gatewayUrls,
    strict,
    supportedContentTypes,
  }: GetAbiRecordParameters) => Promise<GetAbiRecordReturnType>
  /**
   * Gets an address record for a name and specified coin
   * @param parameters - {@link GetAddressRecordParameters}
   * @returns Coin value object, or `null` if not found. {@link GetAddressRecordReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getAddressRecord({ name: 'ens.eth', coin: 'ETH' })
   * // { id: 60, name: 'ETH , value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }
   */
  getAddressRecord: ({
    name,
    coin,
    bypassFormat,
    gatewayUrls,
    strict,
  }: GetAddressRecordParameters) => Promise<GetAddressRecordReturnType>
  /**
   * Gets the availability of a name to register
   * @param parameters - {@link GetAvailableParameters}
   * @returns Availability as boolean. {@link GetAvailableReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getAvailable({ name: 'ens.eth' })
   * // false
   */
  getAvailable: ({
    name,
  }: GetAvailableParameters) => Promise<GetAvailableReturnType>
  /**
   * Gets the content hash record for a name
   * @param parameters - {@link GetContentHashRecordParameters}
   * @returns Content hash object, or `null` if not found. {@link GetContentHashRecordReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getContentHashRecord({ name: 'ens.eth' })
   * // { protocolType: 'ipfs', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' }
   */
  getContentHashRecord: ({
    name,
    gatewayUrls,
    strict,
  }: GetContentHashRecordParameters) => Promise<GetContentHashRecordReturnType>
  /**
   * Gets the expiry for a name
   * @param parameters - {@link GetExpiryParameters}
   * @returns Expiry object, or `null` if no expiry. {@link GetExpiryReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getExpiry({ name: 'ens.eth' })
   * // { expiry: { date: Date, value: 1913933217n }, gracePeriod: 7776000, status: 'active' }
   */
  getExpiry: ({
    name,
    contract,
  }: GetExpiryParameters) => Promise<GetExpiryReturnType>
  /**
   * Gets the primary name for an address
   * @param parameters - {@link GetNameParameters}
   * @returns Name data object, or `null` if no primary name is set. {@link GetNameReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getName({ address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5' })
   * // { name: 'nick.eth', match: true, reverseResolverAddress: '0xa2c122be93b0074270ebee7f6b7292c7deb45047', resolverAddress: '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41' }
   */
  getName: ({
    address,
    allowMismatch,
    gatewayUrls,
    strict,
  }: GetNameParameters) => Promise<GetNameReturnType>
  /**
   * Gets the owner(s) of a name.
   * @param parameters - {@link GetOwnerParameters}
   * @returns Owner data object, or `null` if no owners exist. {@link GetOwnerReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getOwner({ name: 'ens.eth' })
   * // { owner: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9', registrant: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9', ownershipLevel: 'registrar }
   */
  getOwner: ({
    name,
    contract,
  }: GetOwnerParameters) => Promise<GetOwnerReturnType>
  /**
   * Gets the price of a name, or array of names, for a given duration.
   * @param parameters - {@link GetPriceParameters}
   * @returns Price data object. {@link GetPriceReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getPrice({ nameOrNames: 'ens.eth' })
   * // { base: 352828971668930335n, premium: 0n }
   */
  getPrice: ({
    nameOrNames,
    duration,
  }: GetPriceParameters) => Promise<GetPriceReturnType>
  /**
   * Gets arbitrary records for a name
   * @param parameters - {@link GetRecordsParameters}
   * @returns Records data object. {@link GetRecordsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getRecords({
   *   name: 'ens.eth',
   *   texts: ['com.twitter', 'com.github'],
   *   coins: ['ETH'],
   *   contentHash: true,
   * })
   * // { texts: [{ key: 'com.twitter', value: 'ensdomains' }, { key: 'com.github', value: 'ensdomains' }], coins: [{ id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }], contentHash: { protocolType: 'ipns', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' } }
   */
  getRecords: <
    const TTexts extends readonly string[] = readonly string[],
    const TCoins extends readonly (string | number)[] = readonly (
      | string
      | number
    )[],
    const TContentHash extends boolean = true,
    const TAbi extends boolean = true,
  >({
    name,
    texts,
    coins,
    contentHash,
    abi,
    resolver,
    gatewayUrls,
  }: GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>) => Promise<
    GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>
  >
  /**
   * Gets the resolver address for a name.
   * @param parameters - {@link GetResolverParameters}
   * @returns Resolver address, or null if none is found. {@link GetResolverReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getResolver({ name: 'ens.eth' })
   * // 0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41
   */
  getResolver: ({
    name,
  }: GetResolverParameters) => Promise<GetResolverReturnType>
  /**
   * Gets a text record for a name.
   * @param parameters - {@link GetTextRecordParameters}
   * @returns Text record string, or null if none is found. {@link GetTextRecordReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getTextRecord({ name: 'ens.eth', key: 'com.twitter' })
   * // ensdomains
   */
  getTextRecord: ({
    name,
    key,
    gatewayUrls,
    strict,
  }: GetTextRecordParameters) => Promise<GetTextRecordReturnType>
  /**
   * Gets the wrapper data for a name.
   * @param parameters - {@link GetWrapperDataParameters}
   * @returns Wrapper data object, or null if name is not wrapped. {@link GetWrapperDataReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getWrapperData({ name: 'ilikelasagna.eth' })
   */
  getWrapperData: ({
    name,
  }: GetWrapperDataParameters) => Promise<GetWrapperDataReturnType>
  /**
   * Gets the full name for a name with unknown labels from the NameWrapper.
   * @param parameters - {@link GetWrapperNameParameters}
   * @returns Full name, or null if name was not found. {@link GetWrapperNameReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensPublicActions)
   * const result = await client.getWrapperName({ name: '[4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b].eth' })
   * // wrapped.eth
   */
  getWrapperName: ({
    name,
  }: GetWrapperNameParameters) => Promise<GetWrapperNameReturnType>
}

/**
 * Extends the viem client with ENS public actions
 * @param client - The viem {@link Client} object to add the ENS public actions to
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * }).extend(ensPublicActions)
 */
export const ensPublicActions = <
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
  TAccount extends Account | undefined = Account | undefined,
>(
  client: Client<TTransport, TChain, TAccount>,
): EnsPublicActions => ({
  ensBatch: (...parameters) => batch(client, ...parameters),
  getAbiRecord: (parameters) => getAbiRecord(client, parameters),
  getAddressRecord: (parameters) => getAddressRecord(client, parameters),
  getAvailable: (parameters) => getAvailable(client, parameters),
  getContentHashRecord: (parameters) =>
    getContentHashRecord(client, parameters),
  getExpiry: (parameters) => getExpiry(client, parameters),
  getName: (parameters) => getName(client, parameters),
  getOwner: (parameters) => getOwner(client, parameters),
  getPrice: (parameters) => getPrice(client, parameters),
  getRecords: (parameters) => getRecords(client, parameters),
  getResolver: (parameters) => getResolver(client, parameters),
  getTextRecord: (parameters) => getTextRecord(client, parameters),
  getWrapperData: (parameters) => getWrapperData(client, parameters),
  getWrapperName: (parameters) => getWrapperName(client, parameters),
})
