"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNSProver = exports.DEFAULT_ALGORITHMS = exports.DEFAULT_DIGESTS = exports.NoValidDnskeyError = exports.NoValidDsError = exports.ResponseCodeError = exports.SignedSet = exports.dohQuery = exports.answersToString = exports.getKeyTag = exports.DEFAULT_TRUST_ANCHORS = void 0;
const packet = require("dns-packet");
const packet_types = require("dns-packet/types");
const ethereumjs_util_1 = require("ethereumjs-util");
const log_1 = require("./log");
const node_fetch_1 = require("node-fetch");
exports.DEFAULT_TRUST_ANCHORS = [
    {
        name: ".",
        type: "DS",
        class: "IN",
        data: {
            keyTag: 19036,
            algorithm: 8,
            digestType: 2,
            digest: Buffer.from("49AAC11D7B6F6446702E54A1607371607A1A41855200FD2CE1CDDE32F24E8FB5", "hex"),
        },
    },
    {
        name: ".",
        type: "DS",
        class: "IN",
        data: {
            keyTag: 20326,
            algorithm: 8,
            digestType: 2,
            digest: Buffer.from("E06D44B80B8F1D39A95C0B0D7C65D08458E880409BBC683457104237C7F8EC8D", "hex"),
        },
    },
];
function encodeURLParams(p) {
    return Object.entries(p)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");
}
function getKeyTag(key) {
    const data = packet.dnskey.encode(key.data).slice(2);
    let keytag = 0;
    for (var i = 0; i < data.length; i++) {
        var v = data[i];
        if ((i & 1) !== 0) {
            keytag += v;
        }
        else {
            keytag += v << 8;
        }
    }
    keytag += (keytag >> 16) & 0xffff;
    keytag &= 0xffff;
    return keytag;
}
exports.getKeyTag = getKeyTag;
function answersToString(a) {
    const s = a.map((a) => {
        const prefix = `${a.name} ${a.ttl} ${a.class} ${a.type}`;
        const d = a.data;
        switch (a.type) {
            case "A":
                return `${prefix} ${d}`;
            case "DNSKEY":
                return `${prefix} ${d.flags} 3 ${d.algorithm} ${d.key.toString("base64")}; keyTag=${getKeyTag(a)}`;
            case "DS":
                return `${prefix} ${d.keyTag} ${d.algorithm} ${d.digestType} ${d.digest.toString("hex")}`;
            case "OPT":
                return `${prefix}`;
            case "RRSIG":
                return `${prefix} ${d.typeCovered} ${d.algorithm} ${d.labels} ${d.originalTTL} ${d.expiration} ${d.inception} ${d.keyTag} ${d.signersName} ${d.signature.toString("base64")}`;
            case "TXT":
                const texts = d.map((t) => `"${t}"`);
                return `${prefix} ${texts.join(" ")}`;
        }
    });
    return s.join("\n");
}
exports.answersToString = answersToString;
function dohQuery(url) {
    return function getDNS(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const buf = packet.encode(q);
            const response = yield node_fetch_1.default(url +
                "?" +
                encodeURLParams({
                    ct: "application/dns-udpwireformat",
                    dns: buf.toString("base64"),
                    ts: Date.now().toString(),
                }));
            return packet.decode(Buffer.from(yield response.arrayBuffer()));
        });
    };
}
exports.dohQuery = dohQuery;
class SignedSet {
    constructor(records, signature) {
        this.records = records;
        this.signature = signature;
    }
    static fromWire(data, signatureData) {
        const { rdata, length } = this.readRrsigRdata(data);
        rdata.signature = signatureData;
        const rrs = [];
        let off = length;
        while (off < data.length) {
            rrs.push(packet.answer.decode(data, off));
            off += packet.answer.decode.bytes;
        }
        return new SignedSet(rrs, {
            name: rrs[0].name,
            type: "RRSIG",
            class: rrs[0].class,
            data: rdata,
        });
    }
    static readRrsigRdata(data) {
        let offset = 0;
        return {
            rdata: {
                typeCovered: packet_types.toString(data.readUInt16BE(0)),
                algorithm: data.readUInt8(2),
                labels: data.readUInt8(3),
                originalTTL: data.readUInt32BE(4),
                expiration: data.readUInt32BE(8),
                inception: data.readUInt32BE(12),
                keyTag: data.readUInt16BE(16),
                signersName: packet.name.decode(data, 18),
                signature: Buffer.of(),
            },
            length: 18 + packet.name.decode.bytes,
        };
    }
    toWire(withRrsig = true) {
        let rrset = Buffer.concat(this.records
            // https://tools.ietf.org/html/rfc4034#section-6
            .sort((a, b) => {
            const aenc = packet.record(a.type).encode(a.data).slice(2);
            const benc = packet.record(b.type).encode(b.data).slice(2);
            return aenc.compare(benc);
        })
            .map((r) => packet.answer.encode(Object.assign(r, {
            name: r.name.toLowerCase(),
            ttl: this.signature.data.originalTTL,
        }))));
        if (withRrsig) {
            let rrsig = packet.rrsig
                .encode(Object.assign({}, this.signature.data, { signature: Buffer.of() }))
                .slice(2);
            return Buffer.concat([rrsig, rrset]);
        }
        else {
            return rrset;
        }
    }
}
exports.SignedSet = SignedSet;
class ResponseCodeError extends Error {
    constructor(query, response) {
        super("DNS server responded with " + response.rcode);
        this.name = "ResponseError";
        this.query = query;
        this.response = response;
    }
}
exports.ResponseCodeError = ResponseCodeError;
class NoValidDsError extends Error {
    constructor(keys) {
        super(`Could not find a DS record to validate any RRSIG on DNSKEY records for ${keys[0].name}`);
        this.keys = keys;
        this.name = "NoValidDsError";
    }
}
exports.NoValidDsError = NoValidDsError;
class NoValidDnskeyError extends Error {
    constructor(result) {
        super(`Could not find a DNSKEY record to validate any RRSIG on ${result[0].type} records for ${result[0].name}`);
        this.result = result;
        this.name = "NoValidDnskeyError";
    }
}
exports.NoValidDnskeyError = NoValidDnskeyError;
exports.DEFAULT_DIGESTS = {
    // SHA256
    1: {
        name: "SHA1",
        f: (data, digest) => {
            return true;
        },
    },
    2: {
        name: "SHA256",
        f: (data, digest) => {
            return ethereumjs_util_1.sha256(data).equals(digest);
        },
    },
};
exports.DEFAULT_ALGORITHMS = {
    5: {
        name: "RSASHA1Algorithm",
        f: (key, data, sig) => {
            return true;
        },
    },
    7: {
        name: "RSASHA1Algorithm",
        f: (key, data, sig) => {
            return true;
        },
    },
    8: {
        name: "RSASHA256",
        f: (key, data, sig) => {
            return true;
        },
    },
    13: {
        name: "P256SHA256",
        f: (key, data, sig) => {
            return true;
        },
    },
};
function isTypedArray(array) {
    return array.every((a) => a.type == "DNSKEY");
}
function makeIndex(values, fn) {
    const ret = {};
    for (const value of values) {
        const key = fn(value);
        let list = ret[key];
        if (list === undefined) {
            list = ret[key] = [];
        }
        list.push(value);
    }
    return ret;
}
class DNSProver {
    constructor(sendQuery, digests = exports.DEFAULT_DIGESTS, algorithms = exports.DEFAULT_ALGORITHMS, anchors = exports.DEFAULT_TRUST_ANCHORS) {
        this.sendQuery = sendQuery;
        this.digests = digests;
        this.algorithms = algorithms;
        this.anchors = anchors;
    }
    static create(url) {
        return new DNSProver(dohQuery(url));
    }
    queryWithProof(qtype, qname) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DNSQuery(this).queryWithProof(qtype, qname);
        });
    }
}
exports.DNSProver = DNSProver;
class DNSQuery {
    constructor(prover) {
        this.cache = {};
        this.prover = prover;
    }
    queryWithProof(qtype, qname) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.dnsQuery(qtype.toString(), qname);
            const answers = response.answers.filter((r) => r.type === qtype && r.name === qname);
            log_1.logger.info(`Found ${answers.length} ${qtype} records for ${qname}`);
            if (answers.length === 0) {
                return null;
            }
            const sigs = response.answers.filter((r) => r.type === "RRSIG" && r.name === qname && r.data.typeCovered === qtype);
            log_1.logger.info(`Found ${sigs.length} RRSIGs over ${qtype} RRSET`);
            // If the records are self-signed, verify with DS records
            if (isTypedArray(answers) &&
                sigs.some((sig) => sig.name === sig.data.signersName)) {
                log_1.logger.info(`DNSKEY RRSET on ${answers[0].name} is self-signed; attempting to verify with a DS in parent zone`);
                return this.verifyWithDS(answers, sigs);
            }
            else {
                return this.verifyRRSet(answers, sigs);
            }
        });
    }
    verifyRRSet(answers, sigs) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const sig of sigs) {
                const algorithms = this.prover.algorithms;
                log_1.logger.info(`Attempting to verify the ${answers[0].type} RRSET on ${answers[0].name} with RRSIG=${sig.data.keyTag}/${((_a = algorithms[sig.data.algorithm]) === null || _a === void 0 ? void 0 : _a.name) || sig.data.algorithm}`);
                const ss = new SignedSet(answers, sig);
                if (!(sig.data.algorithm in algorithms)) {
                    log_1.logger.info(`Skipping RRSIG=${sig.data.keyTag}/${sig.data.algorithm} on ${answers[0].type} RRSET for ${answers[0].name}: Unknown algorithm`);
                    continue;
                }
                const result = yield this.queryWithProof("DNSKEY", sig.data.signersName);
                if (result === null) {
                    throw new NoValidDnskeyError(answers);
                }
                const { answer, proofs } = result;
                for (const key of answer.records) {
                    if (this.verifySignature(ss, key)) {
                        log_1.logger.info(`RRSIG=${sig.data.keyTag}/${algorithms[sig.data.algorithm].name} verifies the ${answers[0].type} RRSET on ${answers[0].name}`);
                        proofs.push(answer);
                        return { answer: ss, proofs: proofs };
                    }
                }
            }
            log_1.logger.warn(`Could not verify the ${answers[0].type} RRSET on ${answers[0].name} with any RRSIGs`);
            throw new NoValidDnskeyError(answers);
        });
    }
    verifyWithDS(keys, sigs) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const keyname = keys[0].name;
            // Fetch the DS records to use
            let answer;
            let proofs;
            if (keyname === ".") {
                [answer, proofs] = [this.prover.anchors, []];
            }
            else {
                const response = yield this.queryWithProof("DS", keyname);
                if (response === null) {
                    throw new NoValidDsError(keys);
                }
                answer = response.answer.records;
                proofs = response.proofs;
                proofs.push(response.answer);
            }
            // Index the passed in keys by key tag
            const keysByTag = makeIndex(keys, getKeyTag);
            const sigsByTag = makeIndex(sigs, (sig) => sig.data.keyTag);
            // Iterate over the DS records looking for keys we can verify
            const algorithms = this.prover.algorithms;
            const digests = this.prover.digests;
            for (let ds of answer) {
                for (let key of keysByTag[ds.data.keyTag] || []) {
                    if (this.checkDs(ds, key)) {
                        log_1.logger.info(`DS=${ds.data.keyTag}/${((_a = algorithms[ds.data.algorithm]) === null || _a === void 0 ? void 0 : _a.name) || ds.data.algorithm}/${digests[ds.data.digestType].name} verifies DNSKEY=${ds.data.keyTag}/${((_b = algorithms[key.data.algorithm]) === null || _b === void 0 ? void 0 : _b.name) || key.data.algorithm} on ${key.name}`);
                        for (let sig of sigsByTag[ds.data.keyTag] || []) {
                            const ss = new SignedSet(keys, sig);
                            if (this.verifySignature(ss, key)) {
                                log_1.logger.info(`RRSIG=${sig.data.keyTag}/${algorithms[sig.data.algorithm].name} verifies the DNSKEY RRSET on ${keys[0].name}`);
                                return { answer: ss, proofs: proofs };
                            }
                        }
                    }
                }
            }
            log_1.logger.warn(`Could not find any DS records to verify the DNSKEY RRSET on ${keys[0].name}`);
            throw new NoValidDsError(keys);
        });
    }
    verifySignature(answer, key) {
        const keyTag = getKeyTag(key);
        if (key.data.algorithm != answer.signature.data.algorithm ||
            keyTag != answer.signature.data.keyTag ||
            key.name != answer.signature.data.signersName) {
            return false;
        }
        const signatureAlgorithm = this.prover.algorithms[key.data.algorithm];
        if (signatureAlgorithm === undefined) {
            log_1.logger.warn(`Unrecognised signature algorithm for DNSKEY=${keyTag}/${key.data.algorithm} on ${key.name}`);
            return false;
        }
        return signatureAlgorithm.f(key.data.key, answer.toWire(), answer.signature.data.signature);
    }
    checkDs(ds, key) {
        var _a;
        if (key.data.algorithm != ds.data.algorithm || key.name != ds.name) {
            return false;
        }
        const data = Buffer.concat([
            packet.name.encode(ds.name),
            packet.dnskey.encode(key.data).slice(2),
        ]);
        const digestAlgorithm = this.prover.digests[ds.data.digestType];
        if (digestAlgorithm === undefined) {
            log_1.logger.warn(`Unrecognised digest type for DS=${ds.data.keyTag}/${ds.data.digestType}/${((_a = this.prover.algorithms[ds.data.algorithm]) === null || _a === void 0 ? void 0 : _a.name) || ds.data.algorithm} on ${ds.name}`);
            return false;
        }
        return digestAlgorithm.f(data, ds.data.digest);
    }
    dnsQuery(qtype, qname) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                type: "query",
                id: 1,
                flags: packet.RECURSION_DESIRED,
                questions: [
                    {
                        type: qtype,
                        class: "IN",
                        name: qname,
                    },
                ],
                additionals: [
                    {
                        type: "OPT",
                        class: "IN",
                        name: ".",
                        udpPayloadSize: 4096,
                        flags: packet.DNSSEC_OK,
                    },
                ],
                answers: [],
            };
            if (((_a = this.cache[qname]) === null || _a === void 0 ? void 0 : _a[qtype]) === undefined) {
                if (this.cache[qname] === undefined) {
                    this.cache[qname] = {};
                }
                this.cache[qname][qtype] = yield this.prover.sendQuery(query);
            }
            const response = this.cache[qname][qtype];
            log_1.logger.info(`Query[${qname} ${qtype}]:\n` + answersToString(response.answers));
            if (response.rcode !== "NOERROR") {
                throw new ResponseCodeError(query, response);
            }
            return response;
        });
    }
}
