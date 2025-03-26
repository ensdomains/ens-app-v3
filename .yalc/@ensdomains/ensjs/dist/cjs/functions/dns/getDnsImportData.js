"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const dnssecImpl_js_1 = require("../../contracts/dnssecImpl.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const index_js_1 = require("../../index.js");
const serialNumberGt = (i1, i2) => (i1 < i2 && i2 - i1 > 0x7fffffff) || (i1 > i2 && i1 - i2 < 0x7fffffff);
const encodeProofs = (proofs) => proofs.map((proof) => ({
    rrset: (0, viem_1.toHex)(proof.toWire(true)),
    sig: (0, viem_1.toHex)(proof.signature.data.signature),
}));
const getDnsImportData = async (client, { name, endpoint = 'https://cloudflare-dns.com/dns-query', }) => {
    const { DNSProver } = await Promise.resolve().then(() => require('@ensdomains/dnsprovejs'));
    const prover = DNSProver.create(endpoint);
    const result = (await prover.queryWithProof('TXT', `_ens.${name}`));
    const allProofs = result.proofs.concat([result.answer]);
    const rrsets = encodeProofs(allProofs);
    const [onchainRrData, inception] = await (0, actions_1.readContract)(client, {
        abi: dnssecImpl_js_1.dnssecImplVerifyRrSetSnippet,
        address: (0, getChainContractAddress_js_1.getChainContractAddress)({
            client,
            contract: 'ensDnssecImpl',
        }),
        functionName: 'verifyRRSet',
        args: [rrsets],
    });
    const lastProof = allProofs[allProofs.length - 1];
    if (serialNumberGt(inception, lastProof.signature.data.inception))
        throw new index_js_1.DnsNewerRecordTypeAvailableError({
            typeCovered: lastProof.signature.data.typeCovered,
            signatureName: lastProof.signature.name,
            onchainInception: inception,
            dnsInception: lastProof.signature.data.inception,
        });
    if ((0, viem_1.toHex)(lastProof.toWire(false)) !== onchainRrData)
        throw new Error('Mismatched proof data');
    return rrsets;
};
exports.default = getDnsImportData;
//# sourceMappingURL=getDnsImportData.js.map