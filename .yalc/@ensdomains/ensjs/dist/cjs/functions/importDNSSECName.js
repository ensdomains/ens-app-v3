"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNS_OVER_HTTP_ENDPOINT = void 0;
const dnssecoraclejs_1 = require("@ensdomains/dnssecoraclejs");
const dns_packet_1 = __importDefault(require("dns-packet"));
const consts_1 = require("../utils/consts");
exports.DNS_OVER_HTTP_ENDPOINT = 'https://1.1.1.1/dns-query';
async function default_1({ contracts, provider }, name, { address, proverResult }) {
    const dnsRegistrarContract = await contracts?.getDNSRegistrar();
    const resolverContract = await contracts?.getPublicResolver();
    const registrarOracle = await dnsRegistrarContract?.oracle();
    if (!registrarOracle) {
        throw new Error('No oracle found');
    }
    const oracle = new dnssecoraclejs_1.Oracle(registrarOracle, provider);
    const proofData = await oracle.getProofData(proverResult);
    const encodedName = `0x${dns_packet_1.default.name.encode(name).toString('hex')}`;
    const data = proofData.rrsets.map((x) => Object.values(x));
    const { proof } = proofData;
    if (address === consts_1.EMPTY_ADDRESS) {
        return dnsRegistrarContract?.populateTransaction.proveAndClaim(encodedName, data, proof);
    }
    if (address) {
        return dnsRegistrarContract?.populateTransaction.proveAndClaimWithResolver(encodedName, data, proof, resolverContract.address, address);
    }
}
exports.default = default_1;
