import type { ClientWithEns } from '../../contracts/consts.js';
import { type Name } from './utils.js';
type GetSubnamesOrderBy = 'expiryDate' | 'name' | 'labelName' | 'createdAt';
export type GetSubnamesParameters = {
    /** Name to get subnames for */
    name: string;
    /** Search string filter for subname label */
    searchString?: string;
    /** Allows expired names to be included (default: false) */
    allowExpired?: boolean;
    /** Allows deleted names to be included (default: false) */
    allowDeleted?: boolean;
    /** Parameter to order names by (default: name) */
    orderBy?: GetSubnamesOrderBy;
    /** Direction to order names in (default: asc) */
    orderDirection?: 'asc' | 'desc';
    /** Previous page of subnames, used for pagination */
    previousPage?: Name[];
    /** Page size (default: 100) */
    pageSize?: number;
};
export type GetSubnamesReturnType = Name[];
/**
 * Gets the subnames for a name from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetSubnamesParameters}
 * @returns Subname array. {@link GetSubnamesReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getSubnames } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getSubnames(client, { name: 'ens.eth' })
 */
declare const getSubnames: (client: ClientWithEns, { name, searchString, allowExpired, allowDeleted, orderBy, orderDirection, pageSize, previousPage, }: GetSubnamesParameters) => Promise<GetSubnamesReturnType>;
export default getSubnames;
//# sourceMappingURL=getSubnames.d.ts.map