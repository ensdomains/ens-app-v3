import {} from './misc.js';
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
export const getDnsTxtRecords = async ({ name, endpoint = 'https://cloudflare-dns.com/dns-query', }) => {
    const response = await fetch(`${endpoint}?name=${name}.&type=TXT&do=1`, {
        method: 'GET',
        headers: {
            accept: 'application/dns-json',
        },
    }).then((res) => res.json());
    return response;
};
//# sourceMappingURL=getDnsTxtRecords.js.map