import { type Address } from 'viem';
import type { Endpoint } from './types.js';
export type GetDnsOwnerParameters = {
    /** Name to get the owner for */
    name: string;
    /** An RFC-1035 compatible DNS endpoint to use (default: `https://cloudflare-dns.com/dns-query`) */
    endpoint?: Endpoint;
    /** Whether or not to throw errors */
    strict?: boolean;
};
export type GetDnsOwnerReturnType = Address | null;
/**
 * Gets the DNS owner of a name, via DNS record lookup
 * @param parameters - {@link GetDnsOwnerParameters}
 * @returns Address of DNS owner. {@link GetDnsOwnerReturnType}
 *
 * @example
 * import { getDnsOwner } from '@ensdomains/ensjs/dns'
 *
 * const owner = await getDnsOwner({ name: 'ens.domains' })
 * // '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5'
 */
declare const getDnsOwner: ({ name, endpoint, strict, }: GetDnsOwnerParameters) => Promise<GetDnsOwnerReturnType>;
export default getDnsOwner;
//# sourceMappingURL=getDnsOwner.d.ts.map