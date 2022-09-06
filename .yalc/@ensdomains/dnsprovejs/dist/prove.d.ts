/// <reference types="node" />
import * as packet from "dns-packet";
export declare const DEFAULT_TRUST_ANCHORS: packet.Ds[];
export declare function getKeyTag(key: packet.Dnskey): number;
export declare function answersToString(a: packet.Answer[]): string;
export declare function dohQuery(url: string): (q: packet.Packet) => Promise<packet.Packet>;
export declare class SignedSet<T extends packet.Answer> {
    records: T[];
    signature: packet.Rrsig;
    constructor(records: T[], signature: packet.Rrsig);
    static fromWire<T extends packet.Answer>(data: Buffer, signatureData: Buffer): SignedSet<T>;
    private static readRrsigRdata;
    toWire(withRrsig?: boolean): Buffer;
}
export interface ProvableAnswer<T extends packet.Answer> {
    answer: SignedSet<T>;
    proofs: SignedSet<packet.Dnskey | packet.Ds>[];
}
export declare class ResponseCodeError extends Error {
    query: packet.Packet;
    response: packet.Packet;
    constructor(query: packet.Packet, response: packet.Packet);
}
export declare class NoValidDsError extends Error {
    keys: packet.Dnskey[];
    constructor(keys: packet.Dnskey[]);
}
export declare class NoValidDnskeyError<T extends packet.Answer> extends Error {
    result: T[];
    constructor(result: T[]);
}
export declare const DEFAULT_DIGESTS: {
    1: {
        name: string;
        f: (data: Buffer, digest: Buffer) => boolean;
    };
    2: {
        name: string;
        f: (data: Buffer, digest: Buffer) => boolean;
    };
};
export declare const DEFAULT_ALGORITHMS: {
    5: {
        name: string;
        f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
    };
    7: {
        name: string;
        f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
    };
    8: {
        name: string;
        f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
    };
    13: {
        name: string;
        f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
    };
};
export declare class DNSProver {
    sendQuery: (q: packet.Packet) => Promise<packet.Packet>;
    digests: {
        [key: number]: {
            name: string;
            f: (data: Buffer, digest: Buffer) => boolean;
        };
    };
    algorithms: {
        [key: number]: {
            name: string;
            f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
        };
    };
    anchors: packet.Ds[];
    static create(url: string): DNSProver;
    constructor(sendQuery: (q: packet.Packet) => Promise<packet.Packet>, digests?: {
        1: {
            name: string;
            f: (data: Buffer, digest: Buffer) => boolean;
        };
        2: {
            name: string;
            f: (data: Buffer, digest: Buffer) => boolean;
        };
    }, algorithms?: {
        5: {
            name: string;
            f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
        };
        7: {
            name: string;
            f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
        };
        8: {
            name: string;
            f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
        };
        13: {
            name: string;
            f: (key: Buffer, data: Buffer, sig: Buffer) => boolean;
        };
    }, anchors?: packet.Ds[]);
    queryWithProof<T extends packet.Answer["type"]>(qtype: T, qname: string): Promise<ProvableAnswer<Extract<packet.Answer, {
        type: T;
    }> | null>>;
}
