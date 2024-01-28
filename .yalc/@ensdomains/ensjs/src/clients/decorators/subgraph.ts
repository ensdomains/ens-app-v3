import type { Account, Client, Transport } from 'viem'
import type { ChainWithEns } from '../../contracts/consts.js'
import getDecodedName, {
  type GetDecodedNameParameters,
  type GetDecodedNameReturnType,
} from '../../functions/subgraph/getDecodedName.js'
import getNameHistory, {
  type GetNameHistoryParameters,
  type GetNameHistoryReturnType,
} from '../../functions/subgraph/getNameHistory.js'
import getNamesForAddress, {
  type GetNamesForAddressParameters,
  type GetNamesForAddressReturnType,
} from '../../functions/subgraph/getNamesForAddress.js'
import getSubgraphRecords, {
  type GetSubgraphRecordsParameters,
  type GetSubgraphRecordsReturnType,
} from '../../functions/subgraph/getSubgraphRecords.js'
import getSubgraphRegistrant, {
  type GetSubgraphRegistrantParameters,
  type GetSubgraphRegistrantReturnType,
} from '../../functions/subgraph/getSubgraphRegistrant.js'
import getSubnames, {
  type GetSubnamesParameters,
  type GetSubnamesReturnType,
} from '../../functions/subgraph/getSubnames.js'

export type EnsSubgraphActions = {
  /**
   * Gets the full name for a name with unknown labels from the subgraph.
   * @param parameters - {@link GetDecodedNameParameters}
   * @returns Full name, or null if name was could not be filled. {@link GetDecodedNameReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensSubgraphActions)
   * const result = await client.getDecodedName({ name: '[5cee339e13375638553bdf5a6e36ba80fb9f6a4f0783680884d92b558aa471da].eth' })
   * // ens.eth
   */
  getDecodedName: ({
    name,
    allowIncomplete,
  }: GetDecodedNameParameters) => Promise<GetDecodedNameReturnType>
  /**
   * Gets the history of a name from the subgraph.
   * @param parameters - {@link GetNameHistoryParameters}
   * @returns History object, or null if name could not be found. {@link GetNameHistoryReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensSubgraphActions)
   * const result = await client.getNameHistory({ name: 'ens.eth' })
   */
  getNameHistory: ({
    name,
  }: GetNameHistoryParameters) => Promise<GetNameHistoryReturnType>
  /**
   * Gets the names for an address from the subgraph.
   * @param parameters - {@link GetNamesForAddressParameters}
   * @returns Name array. {@link GetNamesForAddressReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensSubgraphActions)
   * const result = await client.getNamesForAddress({ address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' })
   */
  getNamesForAddress: ({
    address,
    filter,
    orderBy,
    orderDirection,
    pageSize,
    previousPage,
  }: GetNamesForAddressParameters) => Promise<GetNamesForAddressReturnType>
  /**
   * Gets the records for a name from the subgraph
   * @param parameters - {@link GetSubgraphRecordsParameters}
   * @returns Record object, or null if name was not found. {@link GetSubgraphRecordsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensSubgraphActions)
   * const result = await client.getSubgraphRecords({ name: 'ens.eth' })
   * // {
   * //   isMigrated: true,
   * //   createdAt: { date: 2019-08-26T05:09:01.000Z, value: 1566796141000 },
   * //   texts: [ 'snapshot', 'url', 'avatar', 'com.twitter', 'com.github' ],
   * //   coins: [ '60' ]
   * // }
   */
  getSubgraphRecords: ({
    name,
    resolverAddress,
  }: GetSubgraphRecordsParameters) => Promise<GetSubgraphRecordsReturnType>
  /**
   * Gets the name registrant from the subgraph.
   * @param parameters - {@link GetSubgraphRegistrantParameters}
   * @returns Registrant address, or null if name was not found. {@link GetSubgraphRegistrantReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensSubgraphActions)
   * const result = await client.getSubgraphRegistrant({ name: 'ens.eth' })
   * // 0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9
   */
  getSubgraphRegistrant: ({
    name,
  }: GetSubgraphRegistrantParameters) => Promise<GetSubgraphRegistrantReturnType>
  /**
   * Gets the subnames for a name from the subgraph.
   * @param parameters - {@link GetSubnamesParameters}
   * @returns Subname array. {@link GetSubnamesReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
   *
   * const client = createPublicClient({
   *   chain: addEnsContracts(mainnet),
   *   transport: http(),
   * }).extend(ensSubgraphActions)
   * const result = await client.getSubnames({ name: 'ens.eth' })
   */
  getSubnames: ({
    name,
    searchString,
    allowExpired,
    allowDeleted,
    orderBy,
    orderDirection,
    pageSize,
    previousPage,
  }: GetSubnamesParameters) => Promise<GetSubnamesReturnType>
}

/**
 * Extends the viem client with ENS subgraph actions
 * @param client - The viem {@link Client} object to add the ENS subgraph actions to
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * }).extend(ensSubgraphActions)
 */
export const ensSubgraphActions = <
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
  TAccount extends Account | undefined = Account | undefined,
>(
  client: Client<TTransport, TChain, TAccount>,
): EnsSubgraphActions => ({
  getDecodedName: (parameters) => getDecodedName(client, parameters),
  getNameHistory: (parameters) => getNameHistory(client, parameters),
  getNamesForAddress: (parameters) => getNamesForAddress(client, parameters),
  getSubgraphRecords: (parameters) => getSubgraphRecords(client, parameters),
  getSubgraphRegistrant: (parameters) =>
    getSubgraphRegistrant(client, parameters),
  getSubnames: (parameters) => getSubnames(client, parameters),
})
