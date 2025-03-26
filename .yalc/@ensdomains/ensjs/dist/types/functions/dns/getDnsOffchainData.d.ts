import { type Address, type Client, type Transport } from 'viem';
import type { ChainWithEns } from '../../contracts/consts.js';
import type { Endpoint } from './types.js';
export type GetDnsOffchainDataParameters = {
    /** Name to get the offchain data for */
    name: string;
    /** An RFC-1035 compatible DNS endpoint to use (default: `https://cloudflare-dns.com/dns-query`) */
    endpoint?: Endpoint;
    /** Whether or not to throw errors */
    strict?: boolean;
};
export type GetDnsOffchainDataReturnType = {
    resolverAddress: Address;
    extraData: string | null;
} | null;
/**
 * Gets the DNS offchain data for a name, via DNS record lookup
 * @param parameters - {@link GetDnsOffchainDataParameters}
 * @returns Resolver address and extra data, or null. {@link GetDnsOffchainDataReturnType}
 *
 * @example
 * import { getDnsOffchainData } from '@ensdomains/ensjs/dns'
 *
 * const owner = await getDnsOffchainData({ name: 'ethleaderboard.xyz' })
 */
declare const getDnsOffchainData: (client: Client<Transport, ChainWithEns>, { name, endpoint, strict }: GetDnsOffchainDataParameters) => Promise<GetDnsOffchainDataReturnType>;
export default getDnsOffchainData;
//# sourceMappingURL=getDnsOffchainData.d.ts.map