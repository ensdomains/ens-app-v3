import * as packet from 'dns-packet';
export declare function encodeURLParams(p: {
    [key: string]: string;
}): string;
export declare const getDNS: (q: packet.Packet) => Promise<packet.Packet>;
export declare const dnsQuery: (qtype: string, qname: string) => Promise<packet.Packet>;
export default function (dnsName: string): Promise<any>;
