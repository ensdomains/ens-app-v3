import { SignedSet } from '@ensdomains/dnsprovejs';
import { toHex } from 'viem';
import { readContract } from 'viem/actions';
import { dnssecImplVerifyRrSetSnippet } from '../../contracts/dnssecImpl.js';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { DnsNewerRecordTypeAvailableError } from '../../index.js';
// Compares two serial numbers using RFC1982 serial number math.
const serialNumberGt = (i1, i2) => (i1 < i2 && i2 - i1 > 0x7fffffff) || (i1 > i2 && i1 - i2 < 0x7fffffff);
const encodeProofs = (proofs) => proofs.map((proof) => ({
    rrset: toHex(proof.toWire(true)),
    sig: toHex(proof.signature.data.signature),
}));
/**
 * Gets DNS import data, used for `importDnsName()`
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetDnsImportDataParameters}
 * @returns DNS import data object, used for proving the value of the `_ens` TXT record
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getDnsImportData } from '@ensdomains/ensjs/dns'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const data = await getDnsImportData(client, {
 *   name: 'example.eth',
 * })
 */
const getDnsImportData = async (client, { name, endpoint = 'https://cloudflare-dns.com/dns-query', }) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { DNSProver } = await import('@ensdomains/dnsprovejs');
    const prover = DNSProver.create(endpoint);
    const result = (await prover.queryWithProof('TXT', `_ens.${name}`));
    const allProofs = result.proofs.concat([result.answer]);
    const rrsets = encodeProofs(allProofs);
    const [onchainRrData, inception] = await readContract(client, {
        abi: dnssecImplVerifyRrSetSnippet,
        address: getChainContractAddress({
            client,
            contract: 'ensDnssecImpl',
        }),
        functionName: 'verifyRRSet',
        args: [rrsets],
    });
    const lastProof = allProofs[allProofs.length - 1];
    if (serialNumberGt(inception, lastProof.signature.data.inception))
        throw new DnsNewerRecordTypeAvailableError({
            typeCovered: lastProof.signature.data.typeCovered,
            signatureName: lastProof.signature.name,
            onchainInception: inception,
            dnsInception: lastProof.signature.data.inception,
        });
    if (toHex(lastProof.toWire(false)) !== onchainRrData)
        throw new Error('Mismatched proof data');
    return rrsets;
};
export default getDnsImportData;
//# sourceMappingURL=getDnsImportData.js.map