"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_js_1 = require("dns-packet/types.js");
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const dnssecImpl_js_1 = require("../../contracts/dnssecImpl.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const dns_js_1 = require("../../errors/dns.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const serialNumberGt = (i1, i2) => (i1 < i2 && i2 - i1 > 0x7fffffff) || (i1 > i2 && i1 - i2 < 0x7fffffff);
const encodeProofs = (proofs) => proofs.map((proof) => ({
    rrset: proof.toWire(true),
    sig: proof.signature.data.signature,
}));
const getDnsImportData = async (client, { name, endpoint = 'https://cloudflare-dns.com/dns-query', }) => {
    const { DNSProver } = await import('@ensdomains/dnsprovejs');
    const prover = DNSProver.create(endpoint);
    const result = (await prover.queryWithProof('TXT', `_ens.${name}`));
    const allProofs = result.proofs.concat([result.answer]);
    const ensDnssecImplAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensDnssecImpl',
    });
    for (let i = allProofs.length - 1; i >= 0; i -= 1) {
        const proof = allProofs[i];
        const hexEncodedName = (0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(proof.signature.name));
        const type = (0, types_js_1.toType)(proof.signature.data.typeCovered);
        const [inception, expiration, hash] = await (0, actions_1.readContract)(client, {
            abi: dnssecImpl_js_1.dnssecImplRrDataSnippet,
            address: ensDnssecImplAddress,
            functionName: 'rrdata',
            args: [type, hexEncodedName],
        });
        if (serialNumberGt(inception, proof.signature.data.inception))
            throw new dns_js_1.DnsNewerRecordTypeAvailableError({
                typeCovered: proof.signature.data.typeCovered,
                signatureName: proof.signature.name,
                onchainInception: inception,
                dnsInception: proof.signature.data.inception,
            });
        const expired = serialNumberGt(Date.now() / 1000, expiration);
        const proofHash = (0, viem_1.keccak256)(proof.toWire(false)).slice(0, 42);
        const isKnownProof = hash === proofHash && !expired;
        if (isKnownProof) {
            if (i === allProofs.length - 1) {
                return { rrsets: [], proof: proof.toWire(false) };
            }
            return {
                rrsets: encodeProofs(allProofs.slice(i + 1, allProofs.length)),
                proof: proof.toWire(false),
            };
        }
    }
    return {
        rrsets: encodeProofs(allProofs),
        proof: (0, viem_1.toBytes)(await (0, actions_1.readContract)(client, {
            abi: dnssecImpl_js_1.dnssecImplAnchorsSnippet,
            address: ensDnssecImplAddress,
            functionName: 'anchors',
        })),
    };
};
exports.default = getDnsImportData;
//# sourceMappingURL=getDnsImportData.js.map