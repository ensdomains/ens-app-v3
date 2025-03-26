import type { Endpoint } from '../../functions/dns/types.js';
import { type DnsResponse } from './misc.js';
export type GetDnsTxtRecordsParameters = {
    /** Name to get the txt records for */
    name: string;
    /** An RFC-1035 compatible DNS endpoint to use (default: `https://cloudflare-dns.com/dns-query`) */
    endpoint?: Endpoint;
};
export type GetDnsTxtRecordsReturnType = DnsResponse;
/**
 * Gets the DNS record response of a name, via DNS record lookup
 * @param parameters - {@link GetDnsTxtRecordsParameters}
 * @returns DNS response. {@link GetDnsTxtRecordsReturnType}
 *
 * @example
 * import { getDnsTxtRecords } from '@ensdomains/ensjs/utils'
 *
 * const owner = await getDnsTxtRecords({ name: '_ens.ens.domains' })
 */
export declare const getDnsTxtRecords: ({ name, endpoint, }: GetDnsTxtRecordsParameters) => Promise<GetDnsTxtRecordsReturnType>;
//# sourceMappingURL=getDnsTxtRecords.d.ts.map