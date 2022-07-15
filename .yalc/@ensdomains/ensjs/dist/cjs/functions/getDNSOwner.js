"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsQuery = exports.getDNS = exports.encodeURLParams = void 0;
const packet = __importStar(require("dns-packet"));
function encodeURLParams(p) {
    return Object.entries(p)
        .map((kv) => kv.map(encodeURIComponent).join('='))
        .join('&');
}
exports.encodeURLParams = encodeURLParams;
const getDNS = async (q) => {
    const response = await global.fetch(`https://cloudflare-dns.com/dns-query?${encodeURLParams({
        ct: 'application/dns-udpwireformat',
        dns: packet.encode(q)?.toString('base64'),
        ts: Date.now().toString(),
    })}`);
    const arrayBuffer = await response.arrayBuffer();
    // @ts-ignore:next-line
    const fromArrayBuffer = Buffer.from(arrayBuffer);
    return packet.decode(fromArrayBuffer);
};
exports.getDNS = getDNS;
const dnsQuery = async (qtype, qname) => {
    const query = {
        type: 'query',
        id: 1,
        flags: packet.RECURSION_DESIRED,
        questions: [
            {
                type: qtype,
                class: 'IN',
                name: qname,
            },
        ],
        additionals: [
            {
                type: 'OPT',
                class: 'IN',
                name: '.',
                udpPayloadSize: 4096,
                flags: packet.DNSSEC_OK,
            },
        ],
        answers: [],
    };
    const response = await (0, exports.getDNS)(query);
    if (response.rcode !== 'NOERROR') {
        throw new Error(`DNS query failed: ${response.rcode}`);
    }
    return response;
};
exports.dnsQuery = dnsQuery;
async function default_1(_, dnsName) {
    const result = await (0, exports.dnsQuery)('TXT', `_ens.${dnsName}`);
    const address = result?.answers?.[0]?.data?.[0]?.toString()?.split('=')?.[1];
    return address;
}
exports.default = default_1;
