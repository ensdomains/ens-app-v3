"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldEscape = exports.isCombiningMark = exports.tokenise = exports.split = exports.normaliseFragment = exports.emoji = exports.beautify = exports.namehash = exports.normalise = void 0;
const ens_normalize_1 = require("@adraffy/ens-normalize");
const viem_1 = require("viem");
const labels_js_1 = require("./labels.js");
const zeros = new Uint8Array(32);
zeros.fill(0);
const normalise = (name) => (name ? (0, ens_normalize_1.ens_normalize)(name) : name);
exports.normalise = normalise;
function namehash(name) {
    let result = new Uint8Array(32).fill(0);
    if (!name)
        return (0, viem_1.bytesToHex)(result);
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i -= 1) {
        let labelSha;
        if ((0, labels_js_1.isEncodedLabelhash)(labels[i])) {
            labelSha = (0, viem_1.hexToBytes)((0, labels_js_1.decodeLabelhash)(labels[i]));
        }
        else {
            const normalised = (0, exports.normalise)(labels[i]);
            labelSha = (0, viem_1.keccak256)((0, viem_1.stringToBytes)(normalised), 'bytes');
        }
        result = (0, viem_1.keccak256)((0, viem_1.concat)([result, labelSha]), 'bytes');
    }
    return (0, viem_1.bytesToHex)(result);
}
exports.namehash = namehash;
exports.beautify = ens_normalize_1.ens_beautify;
exports.emoji = ens_normalize_1.ens_emoji;
exports.normaliseFragment = ens_normalize_1.ens_normalize_fragment;
exports.split = ens_normalize_1.ens_split;
exports.tokenise = ens_normalize_1.ens_tokenize;
exports.isCombiningMark = ens_normalize_1.is_combining_mark;
exports.shouldEscape = ens_normalize_1.should_escape;
//# sourceMappingURL=normalise.js.map