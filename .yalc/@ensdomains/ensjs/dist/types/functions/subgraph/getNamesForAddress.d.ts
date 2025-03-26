import type { Address } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import { type Name } from './utils.js';
type GetNamesForAddressOrderBy = 'expiryDate' | 'name' | 'labelName' | 'createdAt';
type GetNamesForAddressRelation = {
    /** Names with registrant as address (default: true) */
    registrant?: boolean;
    /** Names with owner as address (default: true) */
    owner?: boolean;
    /** Names with wrapped owner as address (default: true) */
    wrappedOwner?: boolean;
    /** Names with matching resolving address (default: true) */
    resolvedAddress?: boolean;
};
type GetNamesForAddressFilter = GetNamesForAddressRelation & {
    /** Search string filter for name */
    searchString?: string;
    /** Search string filter type (default: `labelName`) */
    searchType?: 'labelName' | 'name';
    /** Allows expired names to be included (default: false) */
    allowExpired?: boolean;
    /** Allows reverse record nodes to be included (default: false) */
    allowReverseRecord?: boolean;
    /** Allows deleted names to be included (default: false) */
    allowDeleted?: boolean;
};
export type GetNamesForAddressParameters = {
    /** Address to get names for */
    address: Address;
    /** Names to get, in relation to address */
    filter?: GetNamesForAddressFilter;
    /** Parameter to order names by (default: name) */
    orderBy?: GetNamesForAddressOrderBy;
    /** Direction to order names in (default: asc) */
    orderDirection?: 'asc' | 'desc';
    /** Previous page of names, used for pagination */
    previousPage?: NameWithRelation[];
    /** Page size (default: 100) */
    pageSize?: number;
};
export type NameWithRelation = Name & {
    relation: GetNamesForAddressRelation;
};
export type GetNamesForAddressReturnType = NameWithRelation[];
/**
 * Gets the names for an address from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetNamesForAddressParameters}
 * @returns Name array. {@link GetNamesForAddressReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getNamesForAddress } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getNamesForAddress(client, { address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' })
 */
declare const getNamesForAddress: (client: ClientWithEns, { address, filter: _filter, orderBy, orderDirection, pageSize, previousPage, }: GetNamesForAddressParameters) => Promise<GetNamesForAddressReturnType>;
export default getNamesForAddress;
//# sourceMappingURL=getNamesForAddress.d.ts.map